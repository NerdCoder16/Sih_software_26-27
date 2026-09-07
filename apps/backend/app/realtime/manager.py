import json
import logging
from typing import List, Set
from fastapi import WebSocket

logger = logging.getLogger("ner-backend.realtime")

class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket connected. Active clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket disconnected. Active clients: {len(self.active_connections)}")

    async def broadcast(self, event_type: str, data: dict):
        if not self.active_connections:
            return
        
        payload = json.dumps({"type": event_type, "data": data})
        stale_connections = set()

        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception as e:
                logger.warning(f"Error sending WS message: {e}")
                stale_connections.add(connection)

        for stale in stale_connections:
            self.disconnect(stale)

manager = ConnectionManager()
