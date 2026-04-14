import os
import json
import asyncio
from typing import Callable

# Setting up a mock framework for Redpanda/Kafka Producer & Consumer
# In a real environment, we would use `confluent_kafka` or `aiokafka`.

KAFKA_BROKER_URL = os.environ.get("KAFKA_BROKER_URL", "localhost:9092")
TOPIC_SENSOR_ALERTS = "sensor-alerts"

class EdgeEventBroker:
    def __init__(self, broker_url: str):
        self.broker_url = broker_url
        print(f"Connecting to Edge Redpanda cluster at {self.broker_url}")
        
    async def publish_alert(self, alert_data: dict):
        """
        Producer: Interfaces with incoming sensor alerts, publishing them
        to a lightweight local Redpanda queue.
        """
        # Mocking publication
        print(f"[PRODUCER] Publishing alert to {TOPIC_SENSOR_ALERTS}: {json.dumps(alert_data)}")
        await asyncio.sleep(0.01) # Simulate network io
        
    async def consume_alerts(self, callback: Callable):
        """
        Consumer: Pulls from the queue at a throttled rate the Triage Engine 
        can handle without crashing out of memory.
        """
        print(f"[CONSUMER] Listening to {TOPIC_SENSOR_ALERTS}...")
        
        # Mocking an endless consumption loop
        try:
            while True:
                # In real scenario: msg = consumer.get()
                await asyncio.sleep(1) # mock delay
                mock_msg = {"sensor_id": "aud_lobby_1", "type": "acoustic_glass_shatter", "level": "critical"}
                await callback(mock_msg)
        except asyncio.CancelledError:
            print("[CONSUMER] Shutting down.")

# Example Usage
if __name__ == "__main__":
    broker = EdgeEventBroker(KAFKA_BROKER_URL)
    
    async def triage_mock(msg):
        print(f"[TRIAGE ENGINE] Processing throttled event: {msg}")
        
    async def run():
        # start consumer
        task = asyncio.create_task(broker.consume_alerts(triage_mock))
        # simulate blast of 5 alerts
        for i in range(5):
            await broker.publish_alert({"sensor_id": f"smoke_{i}", "level": "high"})
        
        await asyncio.sleep(3)
        task.cancel()
        
    asyncio.run(run())
