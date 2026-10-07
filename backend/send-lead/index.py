import hmac
import json
import os
import re
import smtplib
from email.mime.text import MIMEText
from email.header import Header

import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p97508351_furniture_order_land')
SOURCES = {'measure': 'Вызов замерщика', 'quiz': 'Квиз «Узнай цену за 2 минуты»'}

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
}


def respond(status: int, body: dict) -> dict:
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(body, ensure_ascii=False)}


def clean(value, limit: int) -> str:
    return str(value or '').strip()[:limit]


def send_email(subject: str, text: str) -> bool:
    login = os.environ.get('SMTP_LOGIN')
    password = os.environ.get('SMTP_PASSWORD')
    to = os.environ.get('LEADS_EMAIL') or login
    if not login or not password or not to:
        return False
    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header(subject, 'utf-8')
    msg['From'] = login
    msg['To'] = to
    host = os.environ.get('SMTP_HOST') or 'smtp.mail.ru'
    with smtplib.SMTP_SSL(host, 465, timeout=8) as smtp:
        smtp.login(login, password)
        smtp.sendmail(login, [a.strip() for a in to.split(',') if a.strip()], msg.as_string())
    return True


STATUSES = ('new', 'in_work', 'done', 'rejected')


def is_admin(event: dict) -> bool:
    expected = os.environ.get('ADMIN_PASSWORD', '')
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    given = headers.get('x-admin-password', '')
    return bool(expected) and hmac.compare_digest(given.encode(), expected.encode())


def list_leads() -> dict:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            f'SELECT id, source, name, phone, details, status, comment, email_sent, created_at '
            f'FROM {SCHEMA}.leads ORDER BY created_at DESC LIMIT 500'
        )
        cols = ['id', 'source', 'name', 'phone', 'details', 'status', 'comment', 'email_sent', 'created_at']
        items = []
        for row in cur.fetchall():
            item = dict(zip(cols, row))
            item['created_at'] = item['created_at'].isoformat()
            item['source_label'] = SOURCES.get(item['source'], item['source'])
            items.append(item)
    finally:
        conn.close()
    return respond(200, {'items': items})


def update_lead(body: dict) -> dict:
    lead_id = body.get('id')
    if not isinstance(lead_id, int):
        return respond(400, {'error': 'Не указана заявка'})
    sets, params = [], []
    if 'status' in body:
        if body['status'] not in STATUSES:
            return respond(400, {'error': 'Неизвестный статус'})
        sets.append('status = %s')
        params.append(body['status'])
    if 'comment' in body:
        sets.append('comment = %s')
        params.append(clean(body['comment'], 2000) or None)
    if not sets:
        return respond(400, {'error': 'Нечего обновлять'})
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(f'UPDATE {SCHEMA}.leads SET {", ".join(sets)} WHERE id = %s', (*params, lead_id))
        conn.commit()
    finally:
        conn.close()
    return respond(200, {'ok': True})


def handler(event: dict, context) -> dict:
    '''
    Заявки с сайта. POST — принимает заявку (замерщик, квиз), сохраняет и шлёт письмо.
    GET — список заявок, PUT {id, status?, comment?} — смена статуса/комментария (только админ).
    '''
    method = event.get('httpMethod')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}
    if method in ('GET', 'PUT'):
        if not is_admin(event):
            return respond(401, {'error': 'Нужен пароль администратора'})
        if method == 'GET':
            return list_leads()
        return update_lead(json.loads(event.get('body') or '{}'))
    if method != 'POST':
        return respond(405, {'error': 'Method not allowed'})

    body = json.loads(event.get('body') or '{}')
    phone = clean(body.get('phone'), 64)
    if len(re.sub(r'\D', '', phone)) < 10:
        return respond(400, {'error': 'Укажите корректный номер телефона'})

    source = body.get('source') if body.get('source') in SOURCES else 'measure'
    name = clean(body.get('name'), 200)
    answers = body.get('answers') if isinstance(body.get('answers'), dict) else {}
    details = '\n'.join(f'{clean(k, 100)}: {clean(v, 300)}' for k, v in list(answers.items())[:20])

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            f'INSERT INTO {SCHEMA}.leads (source, name, phone, details) VALUES (%s, %s, %s, %s) RETURNING id',
            (source, name or None, phone, details or None),
        )
        lead_id = cur.fetchone()[0]
        conn.commit()

        lines = [f'Новая заявка с сайта svoistil22.ru', '', f'Откуда: {SOURCES[source]}']
        if name:
            lines.append(f'Имя: {name}')
        lines.append(f'Телефон: {phone}')
        if details:
            lines += ['', 'Ответы в квизе:', details]
        subject = f'Заявка с сайта: {phone}' + (f' ({name})' if name else '')

        sent = False
        try:
            sent = send_email(subject, '\n'.join(lines))
        except Exception as e:
            print(f'email error: {e}')
        if sent:
            cur.execute(f'UPDATE {SCHEMA}.leads SET email_sent = TRUE WHERE id = %s', (lead_id,))
            conn.commit()
    finally:
        conn.close()

    return respond(200, {'ok': True})
