from http.server import HTTPServer,SimpleHTTPRequestHandler
from socketserver import BaseServer
import ssl

httpd = HTTPServer(('localhost', 4200), SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket (httpd.socket, certfile='stc.local.pem', keyfile='stc.local-key.pem', server_side=True)
httpd.serve_forever()