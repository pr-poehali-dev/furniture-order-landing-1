import json
import os
from io import BytesIO

import boto3
import urllib.request
from PIL import Image


def handler(event: dict, context) -> dict:
    '''Убирает белый фон у логотипа и сохраняет прозрачный PNG в хранилище.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    body = json.loads(event.get('body') or '{}')
    src_url = body.get('url', 'https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/bucket/2f5b87eb-6740-4714-b5db-c43eb6870ded.png')
    threshold = int(body.get('threshold', 235))

    with urllib.request.urlopen(src_url) as resp:
        raw = resp.read()

    img = Image.open(BytesIO(raw)).convert('RGBA')
    pixels = img.getdata()
    new_pixels = []
    for r, g, b, a in pixels:
        if r >= threshold and g >= threshold and b >= threshold:
            new_pixels.append((r, g, b, 0))
        else:
            new_pixels.append((r, g, b, a))
    img.putdata(new_pixels)

    out = BytesIO()
    img.save(out, format='PNG')
    out.seek(0)

    key = 'logo/svoy-stil-transparent.png'
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=out.getvalue(), ContentType='image/png')
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    print(f"LOGO_TRANSPARENT_URL={cdn_url}")

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps({'url': cdn_url}),
    }