from pythonosc.udp_client import SimpleUDPClient
import time

client = SimpleUDPClient("127.0.0.1", 57120)

while True:
    client.send_message("/trigger", 1)
    time.sleep(0.5)