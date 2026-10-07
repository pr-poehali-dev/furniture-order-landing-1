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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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


def handler(event: dict, context) -> dict:
    '''
    Принимает заявки с сайта (вызов замерщика, квиз), сохраняет их в базу
    и отправляет письмо на почту владельца.
    '''
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}
    if event.get('httpMethod') != 'POST':
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
