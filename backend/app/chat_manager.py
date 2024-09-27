import os
import pandas as pd


from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq

from app.utils import generate_random_session_id
# from langchain_huggingface import HuggingFaceEmbeddings

# from pydantic import BaseModel  # Update this import

class ChatManager:
    def __init__(self):
       
        self.chat_queue = []
        self.chat_observers = []
        self.key = os.getenv("GROQ_API_KEY")
        # Get the absolute path to the CSV file
        self.model = ChatGroq(temperature=0.3, model_name="llama-3.1-70b-versatile", api_key=self.key)
        self.session_id = generate_random_session_id()
        self.instructions = " You are a resourceful virtual grocery shopping assistant speaks usually in english" + \
                            " Your job is to understand the specific needs of the user. If the request is generic, ask for more details" + \
                            " You would have to conver the user request into a table of items (in dutch), items (in english) and their quantities" + \
                            " Once you have the specific details, provide the lowest price for the items that the user wants to buy. " + \
                            " You specialize in finding the best prices and deals from local supermarkets in the Netherlands," + \
                            " including Albert Heijn, ALDI, Jumbo, Lidl, Dirk." + \
                            " You can receive requests of two kinds." + \
                            " Sometime the user will give you a receipe/receipes, in that case, you should list down all the groceries required ( this one should be in dutch) for making that dish(es)for 2 people" + \
                            " In such cases, always produce a list ingredients , quantity (in grams, liters or stuks or other units) and ask the user to confirm." + \
                            " The header should be in english, the content should be in dutch. If there are" + \
                            " changes accomodate that through conversation. Wait for user to confirm the ingredients . " + \
                            " Respond in markdown format so that its easy to parse."
        
    
    
    def gen_agent_instruction(self):
        return [SystemMessage(
            content=f"""Here are some general instructions for you:
                        {self.instructions} """
        )]
    
    def get_session_id(self):
        return self.session_id
    
    async def get_response(self, new_chat):
        await self.update_chat_human(HumanMessage(content=new_chat['value']))
        agent_response = await self.model.ainvoke(self.gen_agent_instruction() + self.chat_queue)

        await self.update_chat_bot(AIMessage(content=agent_response.content))

        return agent_response.content
    
    async def update_chat_human(self, new_chat):
        self.chat_queue.append(new_chat)
    
    async def update_chat_bot(self, new_chat):
        # print(new_chat)
        self.chat_queue.append(new_chat)

    def register_observer(self, observer):
        self.chat_observers.append(observer)
    
    async def notify_chat_observers(self, chat):
        for observer in self.chat_observers:
            await observer.update(chat)

    def get_chat_queue(self):
        return self.chat_queue

    async def generate_initial_chat_obj(self):
        # await self.update_chat_bot(AIMessage(content=response['value']))

        response = {"key": "chat", "value": f"Hi. I am sasta, your personal shopping assistant. \n\n You can ask me about your grocery list or if you have a receipe in mind? " + \
                      "I will find you the lowest price for the items you need."}
        await self.update_chat_bot(AIMessage(content=response['value']))

        return response