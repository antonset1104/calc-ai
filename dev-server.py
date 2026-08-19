"""Server statis untuk pengembangan lokal: python dev-server.py [port]

Menambahkan Cache-Control: no-store supaya perubahan JS/CSS langsung terlihat
tanpa perlu hard reload. Jangan dipakai untuk produksi.
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
    handler = partial(NoCacheHandler, directory=".")
    print(f"http://127.0.0.1:{port}/")
    ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
