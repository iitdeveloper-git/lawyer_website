from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json, re

root=Path(__file__).parent/'dist'
pages=list(root.rglob('index.html'))
assert len(pages)==15, len(pages)
titles=set()
for page in pages:
    html=page.read_text(encoding='utf-8')
    title=re.search(r'<title>(.*?)</title>',html).group(1)
    assert title not in titles, title
    titles.add(title)
    assert '<meta name="description"' in html and '<link rel="canonical"' in html
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',html):
        json.loads(block)
    for value in re.findall(r'(?:href|src)="([^"]+)"',html):
        if not value.startswith('/') or value.startswith('//'):
            continue
        target=root/value.lstrip('/')
        assert target.exists() or (target/'index.html').exists(), (page,value)
assert (root/'sitemap.xml').exists() and (root/'robots.txt').exists()
print(f'Validated {len(pages)} unique pages, local links, JSON-LD, sitemap and robots.')
