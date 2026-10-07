import hmac
import json
import os
import re
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p97508351_furniture_order_land')
KEY_RE = re.compile(r'^[a-z0-9_]{1,128}$')
URL_PREFIX = 'https://cdn.poehali.dev/'
MAX_TEXT = 2000

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
}


PROJECT_MAIN_RE = re.compile(r'^pf_[a-z]+_\d+$')


def respond(status: int, data: dict) -> dict:
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


def handler(event: dict, context) -> dict:
    '''
    Хранит привязку фото сайта к блокам (главный экран, каталог, портфолио).
    GET — отдаёт все сохранённые фото (публично). POST {items: {ключ: url}} — сохраняет
    (только с паролем админа), пустой url удаляет фото. POST {action: "login"} — проверка пароля.
    '''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if method == 'POST' and not is_admin(event):
        return respond(401, {'error': 'Неверный пароль'})

    if method == 'POST':
        body_check = json.loads(event.get('body') or '{}')
        if body_check.get('action') == 'login':
            return respond(200, {'ok': True})

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()

        if method == 'GET':
            cur.execute(f'SELECT slot_key, url, EXTRACT(EPOCH FROM created_at) FROM {SCHEMA}.site_images')
            rows = cur.fetchall()
            images = {k: u for k, u, _ in rows}
            added = {k: int(t or 0) for k, _, t in rows if PROJECT_MAIN_RE.match(k)}
            cur.execute(f'SELECT project_key, description FROM {SCHEMA}.project_texts')
            texts = {k: d for k, d in cur.fetchall()}
            return respond(200, {'images': images, 'texts': texts, 'added': added})

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')

            if body.get('action') == 'save_text':
                key = body.get('key')
                text = body.get('text') or ''
                if not isinstance(key, str) or not KEY_RE.match(key) or not isinstance(text, str):
                    return respond(400, {'error': 'Неверные данные'})
                text = text.strip()[:MAX_TEXT]
                if text:
                    cur.execute(
                        f'INSERT INTO {SCHEMA}.project_texts (project_key, description, updated_at) VALUES (%s, %s, NOW()) '
                        f'ON CONFLICT (project_key) DO UPDATE SET description = EXCLUDED.description, updated_at = NOW()',
                        (key, text),
                    )
                else:
                    cur.execute(f'DELETE FROM {SCHEMA}.project_texts WHERE project_key = %s', (key,))
                conn.commit()
                return respond(200, {'ok': True, 'text': text})

            items = body.get('items') or {}
            if not isinstance(items, dict) or not items:
                return respond(400, {'error': 'Нет данных для сохранения'})

            saved = 0
            for key, url in items.items():
                if not isinstance(key, str) or not KEY_RE.match(key):
                    continue
                if not url:
                    cur.execute(f'DELETE FROM {SCHEMA}.site_images WHERE slot_key = %s', (key,))
                    saved += 1
                    continue
                if not isinstance(url, str) or not url.startswith(URL_PREFIX):
                    continue
                cur.execute(
                    f'INSERT INTO {SCHEMA}.site_images (slot_key, url, updated_at) VALUES (%s, %s, NOW()) '
                    f'ON CONFLICT (slot_key) DO UPDATE SET url = EXCLUDED.url, updated_at = NOW()',
                    (key, url),
                )
                saved += 1
            conn.commit()
            return respond(200, {'saved': saved})

        return respond(405, {'error': 'Method not allowed'})
    finally:
        conn.close()