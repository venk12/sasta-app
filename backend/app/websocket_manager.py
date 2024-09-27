import asyncio
import random
from fastapi import WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState
from app.data_manager import data_manager
# from app.utils import generate_random


class WebSocketManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        data_manager.register_observer(self)

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def is_connected(self, websocket: WebSocket) -> bool:
        return websocket.client_state == WebSocketState.CONNECTED

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def close(self, websocket: WebSocket):
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.close()

    async def send_data(self, websocket: WebSocket, data: dict):
        if websocket.client_state == WebSocketState.CONNECTED:
            try:
                await websocket.send_json(data)
                # self.lsl_manager.send_marker(self.lsl_manager.get_marker('ai_message_sent'))
                print(f"Sent to client: {data}")
            except RuntimeError as e:
                print(f"Error sending data: {e}")

    async def broadcast_data(self, data: dict):
        for connection in self.active_connections:
            try:
                # print(f"Sent to All: {data}")
                await self.send_data(connection, data)
            except RuntimeError as e:
                print(f"Error sending data to all: {e}")

    async def update(self, data: dict):
        await self.broadcast_data(data)

    async def receive_data(self, websocket: WebSocket):
        try:
            data = await websocket.receive_json()
            # print(f"Received: {data}")
            return data
        except WebSocketDisconnect:
            self.disconnect(websocket)
            print("Client disconnected")
            return None
        except Exception as e:
            print(f"Error receiving JSON: {e}")
            return None

    async def send_random_values(self):
        while True:
            if self.active_connections:
                random_data = {"key": "workload", "value": random.random()}
                await self.broadcast_data(random_data)
            await asyncio.sleep(2)
    
    # async def send_continuous(self, websocket: WebSocket, mode: str):
    #     if mode == "random":
    #         while True:
    #             if websocket.client_state == WebSocketState.CONNECTED:
    #                 random_data = await generate_random()
    #                 try:
    #                     await websocket.send_json(random_data)
    #                     print(f"Sending Continuous: {random_data}")
    #                 except RuntimeError as e:
    #                     print(f"Error sending random data: {e}")
    #             await asyncio.sleep(2)

    async def process_json(self, message: dict):
        
        if "key" in message and "value" in message:
            if message["key"] == "user_input":
                # print(f"Received user_input: {message}")
                return "user_input"

            if message["key"] == "initiate":
                # print(f"Received Initiation Request")
                return "initiate"
            
            if message["key"] == 'user_no_comprehension':
                # print(f"Received Help Request (Comprehension): {message}")
                return 'user_no_comprehension'
        
            if message["key"] == "user_no_formation":
                # print(f"Received Help Request (Formation): {message}")
                return 'user_no_formation'
