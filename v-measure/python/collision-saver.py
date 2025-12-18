import unreal
import time
import os

# File to save collisions
log_file = "C:/temp/full_collision_log.txt"
os.makedirs(os.path.dirname(log_file), exist_ok=True)

# Clear previous log
with open(log_file, "w") as f:
    f.write("=== Collision Log Started ===\n\n")

def log_hit_event(component, other_actor, other_component, normal_impulse, hit):
    """Callback for hit events."""
    with open(log_file, "a") as f:
        f.write(f"[{time.time():.2f}] HIT EVENT\n")
        f.write(f"  Actor: {component.get_owner().get_name()}\n")
        f.write(f"  Component: {component.get_name()}\n")
        f.write(f"  Other Actor: {other_actor.get_name()}\n")
        f.write(f"  Other Component: {other_component.get_name()}\n")
        f.write(f"  Location: {hit.location}\n")
        f.write(f"  Normal: {hit.normal}\n")
        f.write(f"  Impulse: {normal_impulse}\n")

        # Attempt to log collision primitive name
        body_setup = component.get_editor_property("body_instance").get_body_setup()
        if body_setup:
            for i, prim in enumerate(body_setup.agents):
                shape_type = prim.get_editor_property("shape_type")
                f.write(f"  Collision Primitive {i}: {shape_type}\n")
        f.write("\n")
    print(f"Logged HIT for {other_actor.get_name()}")

def log_overlap_event(component, other_actor, other_component, body_index, from_sweep, sweep_result):
    """Callback for overlap events."""
    with open(log_file, "a") as f:
        f.write(f"[{time.time():.2f}] OVERLAP EVENT\n")
        f.write(f"  Actor: {component.get_owner().get_name()}\n")
        f.write(f"  Component: {component.get_name()}\n")
        f.write(f"  Other Actor: {other_actor.get_name()}\n")
        f.write(f"  Other Component: {other_component.get_name()}\n")
        if sweep_result:
            f.write(f"  Sweep Hit Location: {sweep_result.location}\n")
        f.write("\n")
    print(f"Logged OVERLAP for {other_actor.get_name()}")

# Enable logging for all static mesh actors in the level
all_actors = unreal.EditorLevelLibrary.get_all_level_actors()
for actor in all_actors:
    mesh_comp = actor.get_component_by_class(unreal.StaticMeshComponent)
    if mesh_comp:
        # Enable physics & hit/overlap events
        mesh_comp.set_editor_property("simulate_physics", True)
        mesh_comp.set_editor_property("generate_hit_events", True)
        mesh_comp.set_editor_property("generate_overlap_events", True)

        # Bind callbacks
        mesh_comp.on_component_hit.add_callable(log_hit_event)
        mesh_comp.on_component_begin_overlap.add_callable(log_overlap_event)

print(f"Collision logging enabled for {len(all_actors)} actors. Logging to {log_file}")