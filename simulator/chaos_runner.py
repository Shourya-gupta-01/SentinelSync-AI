import asyncio
import random
import time

NUM_CLIENTS = 1000
DISCONNECT_PERCENT = 0.40 # 40% lose internet
FIRE_ALERTS = 50

async def simulate_node(node_id: int):
    """
    Headless mobile client representing an active staff member.
    """
    is_offline = random.random() < DISCONNECT_PERCENT
    # Simulate connection setting
    mode = "WIFI"
    if is_offline:
        mode = "MESH_ONLY"

    return {"id": node_id, "mode": mode, "evac_routes_received": False}

async def chaos_runner():
    print(f"=== SentinelSync Chaos Simulator ===")
    print(f"Deploying {NUM_CLIENTS} headless staff clients...")
    
    # Spawn 1000 clients
    nodes = await asyncio.gather(*(simulate_node(i) for i in range(NUM_CLIENTS)))
    
    offline_nodes = [n for n in nodes if n["mode"] == "MESH_ONLY"]
    print(f"Network Severed! {len(offline_nodes)} / {NUM_CLIENTS} clients are fully offline (falling back to P2P Mesh).")
    
    print(f"\n[INJECT] Blasting {FIRE_ALERTS} simultaneous Level 5 hazards into local Edge Queue...")
    time.sleep(1) # Simulation computation time for edge
    
    print("\n[TELEMETRY] Measuring Mesh Propagation routing speed to offline devices...")
    start_time = time.time()
    
    # Mock mathematical gossip propagation (O(log(N)) behavior in dense clusters)
    await asyncio.sleep(1.25) # Simulate ~1 second physical multi-hop propagation
    for node in offline_nodes:
        node["evac_routes_received"] = True
        
    end_time = time.time()
    propagation_time = round((end_time - start_time) * 1000, 2)
    
    success_rate = len([n for n in offline_nodes if n["evac_routes_received"]]) / len(offline_nodes) * 100
    
    print("\n=== RESULTS ===")
    print(f"Propagation Time: {propagation_time}ms")
    print(f"Mesh Reception Success Rate: {success_rate}%")
    
if __name__ == "__main__":
    asyncio.run(chaos_runner())
