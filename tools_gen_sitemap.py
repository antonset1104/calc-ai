#!/usr/bin/env python3
"""
tools_gen_sitemap.py — Generator XML Sitemap Standar Multi-Bahasa
LLM Lab & BenchLM (https://bench.vijeron.com)
"""

import io
from datetime import date

LANGS = ['id', 'en', 'es', 'zh', 'ja', 'fr', 'de', 'ar', 'pt', 'ru', 'ko']
BASE = 'https://bench.vijeron.com'
TODAY = date.today().isoformat()
NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"'

out = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- LLM Lab & BenchLM XML Sitemap (Multi-language SEO with hreflang alternate links) -->',
    f'<urlset {NS}>'
]

def create_url_entry(url, is_primary=False):
    priority = '1.0' if is_primary else '0.8'
    lines = [
        '  <url>',
        f'    <loc>{url}</loc>',
        f'    <lastmod>{TODAY}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        f'    <priority>{priority}</priority>'
    ]
    for lang in LANGS:
        lines.append(f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{BASE}/?lang={lang}"/>')
    lines.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{BASE}/"/>')
    lines.append('  </url>')
    return lines

# 1. Root default URL
out.extend(create_url_entry(f'{BASE}/', is_primary=True))

# 2. Language variants (?lang=xx)
for lang in LANGS:
    out.extend(create_url_entry(f'{BASE}/?lang={lang}', is_primary=(lang == 'id')))

out.append('</urlset>')

output_content = '\n'.join(out) + '\n'

with io.open('sitemap.xml', 'w', encoding='utf-8', newline='\n') as f:
    f.write(output_content)

print(f"Successfully generated sitemap.xml with {1 + len(LANGS)} URL entries (lastmod: {TODAY}).")
