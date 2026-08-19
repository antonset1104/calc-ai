import io
LANGS = ['id','en','es','zh','ja','fr','de','ar','pt','ru','ko']
BASE = 'https://bench.vijeron.com'
NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"'
out = ['<?xml version="1.0" encoding="UTF-8"?>', '<!-- Routing memakai hash (#/leaderboard), sehingga seluruh tampilan berada pada satu dokumen.',
       '     Yang dapat diindeks adalah varian bahasa (?lang=xx) — itulah yang didaftarkan di sini. -->',
       '<urlset %s>' % NS]
def entry(url):
    rows = ['  <url>', '    <loc>%s</loc>' % url, '    <lastmod>2026-08-19</lastmod>',
            '    <changefreq>weekly</changefreq>', '    <priority>%s</priority>' % ('1.0' if url.endswith('lang=id') or url == BASE + '/' else '0.8')]
    for l in LANGS:
        rows.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s/?lang=%s"/>' % (l, BASE, l))
    rows.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s/"/>' % BASE)
    rows.append('  </url>')
    return rows
out += entry(BASE + '/')
for l in LANGS:
    out += entry('%s/?lang=%s' % (BASE, l))
out.append('</urlset>')
io.open('sitemap.xml','w',encoding='utf-8',newline='\n').write('\n'.join(out) + '\n')
print('urls:', 1 + len(LANGS))
