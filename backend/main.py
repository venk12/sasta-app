from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.params import Body
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from app.maps import geocode_postal_code, generate_map_html
import pandas as pd

from app.chat_manager import ChatManager
from app.websocket_manager import WebSocketManager
from app.upload_manager import UploadManager
from app.utils import generate_session_obj, generate_main_agent_response_obj, map_std_category
from dotenv import load_dotenv
from app.search import search_fuzzy, search_embedding


load_dotenv()

websocket_manager = WebSocketManager()
upload_manager = UploadManager()

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


output_path = "output/"
chat_manager = ChatManager()

class MapRequest(BaseModel):
    postal_code: str
    api_key: str

class ChatRequest(BaseModel):
    product_name: str
    quantity: str

class SearchRequest(BaseModel):
    product_name: str
    quantity: str

@app.get("/nearest_stores")
async def get_nearest_stores_map(postal_code):
    # postal_code = request.postal_code
    api_key = "AIzaSyA4M6yxogz-1dhvvoGxLIoKjgPE92qZ4_8"

    latitude, longitude = geocode_postal_code(postal_code)
    if latitude is None or longitude is None:
        raise HTTPException(status_code=404, detail="Location not found.")

    map_html = generate_map_html(api_key, latitude, longitude, output_path)
    return map_html


@app.get("/load_db")
async def load_db():
    df_all_products = pd.read_csv("db/df_all_products.csv")
    return {'key':'status', 'value':200}

@app.get("/get_similar_entries")
async def get_similar_entries(query):
    return upload_manager.get_similar_entries(query)

@app.get("/embedding")
async def get_embedding():
    # 
    return upload_manager.get_data()

@app.post("/search/")
async def search_products_from_db(request: SearchRequest = Body(...)):
    product_name = request.product_name
    quantity = request.quantity

    # assuming the csv has standard categories - need to be fixed
    df_database = pd.read_csv('app/data/df_all_products.csv')

    # sel_category  = map_std_category(product_name)
    product_std_category = await chat_manager.get_std_category(product_name=product_name)
    # df_database = map_std_category(df_database)
    df_result = search_embedding(product_name, product_std_category, df_database)
    print(df_result)

    # Clean the DataFrame to remove or replace non-compliant float values
    df_result = df_result.replace([float('inf'), -float('inf')], None)  # Replace inf with None
    df_result = df_result.dropna()  # Drop rows with NaN values

    # Convert DataFrame to JSON and return
    return df_result.to_dict(orient='records')  # Send as JSON response


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_manager.connect(websocket)

    try:
        while True:
            try:
                message = await websocket_manager.receive_data(websocket)
                if message is None:
                    break
                action = await websocket_manager.process_json(message)
                print(action)

                if action == "initiate":
                    # lsl_manager.send_marker(lsl_manager.get_marker('program_start'))

                    response_obj = await chat_manager.generate_initial_chat_obj()
                    session_obj = await generate_session_obj(chat_manager.get_session_id())

                    if await websocket_manager.is_connected(websocket):
                        await websocket_manager.send_data(websocket, response_obj)
                        await websocket_manager.send_data(websocket, session_obj)

                if action == "user_input":
                     # print("user input received")
                    response = await chat_manager.get_response(message)
                    # print(response)
                    response_obj = await generate_main_agent_response_obj(response)
                    if await websocket_manager.is_connected(websocket):
                        await websocket_manager.send_data(websocket, response_obj)

            except WebSocketDisconnect:
                break
    except WebSocketDisconnect:
        print("Client disconnected")
    finally:
        await websocket_manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)