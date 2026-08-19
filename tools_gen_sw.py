import io, glob, os
files = ['./', './index.html', './css/style.css', './js/app.js', './js/config.js']
for pat in ('js/lib/*.js', 'js/data/*.js', 'js/views/*.js'):
    for p in sorted(glob.glob(pat)):
        files.append('./' + p.replace(os.sep, '/'))
files += ['./assets/icon.svg', './manifest.json', './sitemap.xml', './robots.txt']
core = 'const CORE = [\n' + ''.join("  '%s',\n" % f for f in files) + '];'
p = 'sw.js'
s = io.open(p, encoding='utf-8').read()
start = s.index('const CORE = [')
end = s.index('];', start) + 2
s = s[:start] + core + s[end:]
s = s.replace("const VERSION = 'llmlab-v1';", "const VERSION = 'llmlab-v2';")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('files:', len(files))
