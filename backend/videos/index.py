import base64
import hmac
import json
import os
import re
import uuid
import boto3
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p97508351_furniture_order_land')
URL_PREFIX = 'https://cdn.poehali.dev/'
MIN_PART = 5 * 1024 * 1024
KEY_RE = re.compile(r'^site-videos/[a-f0-9]{32}\.(mp4|mov|webm)$')
EXTS = {'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm'}

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
}


def respond(status: int, data) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }


def is_admin(event: dict) -> bool:
    expected = os.environ.get('ADMIN_PASSWORD', '')
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    given = headers.get('x-admin-password', '')
    return bool(expected) and hmac.compare_digest(given.encode(), expected.encode())


def s3_client():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def read_buffer(s3, key: str) -> bytes:
    try:
        return s3.get_object(Bucket='files', Key=f'{key}.buf')['Body'].read()
    except s3.exceptions.NoSuchKey:
        return b''


def list_videos() -> dict:
    conn = db()
    try:
        cur = conn.cursor()
        cur.execute(f'SELECT id, title, video_url, poster_url FROM {SCHEMA}.videos ORDER BY sort_order, id')
        items = [{'id': r[0], 'title': r[1], 'video_url': r[2], 'poster_url': r[3]} for r in cur.fetchall()]
    finally:
        conn.close()
    return respond(200, {'items': items})


def handle_upload(action: str, body: dict) -> dict:
    s3 = s3_client()
    if action == 'init':
        ext = EXTS.get(body.get('contentType', ''), 'mp4')
        key = f'site-videos/{uuid.uuid4().hex}.{ext}'
        content_type = body.get('contentType') if body.get('contentType') in EXTS else 'video/mp4'
        res = s3.create_multipart_upload(Bucket='files', Key=key, ContentType=content_type)
        return respond(200, {'key': key, 'uploadId': res['UploadId'], 'parts': []})

    key = body.get('key', '')
    upload_id = body.get('uploadId', '')
    parts = body.get('parts') or []
    if not KEY_RE.match(key) or not upload_id:
        return respond(400, {'error': 'Неверные данные загрузки'})

    if action == 'chunk':
        data = read_buffer(s3, key) + base64.b64decode(body.get('data', ''))
        if len(data) >= MIN_PART:
            num = len(parts) + 1
            res = s3.upload_part(Bucket='files', Key=key, UploadId=upload_id, PartNumber=num, Body=data)
            parts.append({'PartNumber': num, 'ETag': res['ETag']})
            s3.delete_object(Bucket='files', Key=f'{key}.buf')
        else:
            s3.put_object(Bucket='files', Key=f'{key}.buf', Body=data)
        return respond(200, {'parts': parts})

    if action == 'complete':
        data = read_buffer(s3, key)
        if data or not parts:
            num = len(parts) + 1
            res = s3.upload_part(Bucket='files', Key=key, UploadId=upload_id, PartNumber=num, Body=data)
            parts.append({'PartNumber': num, 'ETag': res['ETag']})
        s3.complete_multipart_upload(Bucket='files', Key=key, UploadId=upload_id, MultipartUpload={'Parts': parts})
        if data:
            s3.delete_object(Bucket='files', Key=f'{key}.buf')
        url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        return respond(200, {'url': url})

    return respond(400, {'error': 'Неизвестное действие'})


def handle_manage(action: str, body: dict) -> dict:
    conn = db()
    try:
        cur = conn.cursor()
        if action == 'create':
            video_url = body.get('video_url', '')
            poster_url = body.get('poster_url') or None
            if not video_url.startswith(URL_PREFIX) or (poster_url and not poster_url.startswith(URL_PREFIX)):
                return respond(400, {'error': 'Неверная ссылка'})
            title = str(body.get('title', ''))[:200]
            cur.execute(f'SELECT COALESCE(MAX(sort_order), 0) + 1 FROM {SCHEMA}.videos')
            order = cur.fetchone()[0]
            cur.execute(
                f'INSERT INTO {SCHEMA}.videos (title, video_url, poster_url, sort_order) VALUES (%s, %s, %s, %s) RETURNING id',
                (title, video_url, poster_url, order),
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return respond(200, {'id': new_id})
        if action == 'update':
            cur.execute(f'UPDATE {SCHEMA}.videos SET title = %s WHERE id = %s', (str(body.get('title', ''))[:200], int(body.get('id', 0))))
            conn.commit()
            return respond(200, {'ok': True})
        if action == 'delete':
            cur.execute(f'DELETE FROM {SCHEMA}.videos WHERE id = %s', (int(body.get('id', 0)),))
            conn.commit()
            return respond(200, {'ok': True})
        if action == 'reorder':
            for i, vid in enumerate(body.get('ids') or []):
                cur.execute(f'UPDATE {SCHEMA}.videos SET sort_order = %s WHERE id = %s', (i + 1, int(vid)))
            conn.commit()
            return respond(200, {'ok': True})
    finally:
        conn.close()
    return respond(400, {'error': 'Неизвестное действие'})


def handler(event: dict, context) -> dict:
    '''
    Видеообзоры сайта. GET — список роликов (публично).
    POST (только админ): init/chunk/complete — загрузка видеофайла частями в хранилище,
    create/update/delete/reorder — управление списком роликов.
    '''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}
    if method == 'GET':
        return list_videos()
    if method != 'POST':
        return respond(405, {'error': 'Method not allowed'})
    if not is_admin(event):
        return respond(401, {'error': 'Неверный пароль'})

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')
    if action in ('init', 'chunk', 'complete'):
        return handle_upload(action, body)
    return handle_manage(action, body)
