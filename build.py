import os, shutil, sys
SRC = os.getcwd()
DIST = os.path.join(SRC, 'dist')
SKIP_DIRS = {'.git', 'dist', 'node_modules', '__pycache__', '.wrangler'}
SKIP_FILES = {'dev-server.py', 'build.py', 'tools_gen_sw.py', 'tools_gen_sitemap.py', 'README.md', '.gitignore',
              'test_sit.mjs', 'test_i18n_standalone.mjs'}
if os.path.isdir(DIST):
    shutil.rmtree(DIST)
count = 0
for root, dirs, files in os.walk(SRC):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for f in files:
        if f in SKIP_FILES or f.endswith(('.mjs.log',)):
            continue
        src = os.path.join(root, f)
        rel = os.path.relpath(src, SRC)
        dst = os.path.join(DIST, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        count += 1
print('copied', count, 'files to dist/')
for root, dirs, files in os.walk(DIST):
    for f in sorted(files):
        print(' ', os.path.relpath(os.path.join(root, f), DIST))
