import time, subprocess
from pythonosc.udp_client import SimpleUDPClient

client = SimpleUDPClient("127.0.0.1", 57120)

sc = subprocess.Popen([
    "/Applications/SuperCollider.app/Contents/MacOS/sclang", 
    "/Users/stc/Documents/Git/Exp-res/supercollider-sketches/python/sound-engine.scd"])
time.sleep(3)

while True:
    client.send_message("/trigger", 1)
    time.sleep(0.5)