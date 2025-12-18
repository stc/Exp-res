import json
import random
import time

# Helper functions to generate dummy data
def random_name(prefix):
    return f"{prefix}_{random.randint(1, 50)}"

def random_vector():
    return [round(random.uniform(-100, 100), 2) for _ in range(3)]

def random_impulse():
    return round(random.uniform(0, 50), 2)

events = []

for i in range(100):
    event = {
        "timestamp": round(time.time() + i * 0.1, 2),
        "actor": random_name("Actor"),
        "component": random_name("Component"),
        "other_actor": random_name("Actor"),
        "other_component": random_name("Component"),
        "location": random_vector(),
        "normal": random_vector(),
        "impulse": random_impulse()
    }
    events.append(event)

# Write to JSON file
with open("hit_events.json", "w") as f:
    json.dump(events, f, indent=2)

print("Generated hit_events.json with 100 entries.")