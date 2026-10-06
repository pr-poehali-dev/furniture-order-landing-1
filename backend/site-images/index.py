import json
import os
import re
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p97508351_furniture_order_land')
KEY_RE = re.compile(r'^[a-z0-9_]{1,128}$')
URL_PREFIX = 'https://cdn.poehali.dev/'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
}


def respond(status: int, data: dict) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    '''
    Хранит привязку фото сайта к блокам (главный экран, каталог, портфолио).
    GET — отдаёт все сохранённые фото. POST {items: {ключ: url}} — сохраняет,
    пустой url удаляет фото и возвращает стандартное.
    '''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()

        if method == 'GET':
            cur.execute(f'SELECT slot_key, url FROM {SCHEMA}.site_images')
            rows = cur.fetchall()
            return respond(200, {'images': {k: u for k, u in rows}})

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
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
