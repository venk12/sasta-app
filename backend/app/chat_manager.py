import os
import pandas as pd


from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq
from app.prompt_manager import GroceryList

from app.utils import generate_random_session_id, grocery_categories
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
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
        self.instructions = f"""You are a resourceful virtual grocery shopping assistant. 
                            Your job is to understand the specific needs of the user. If the request is generic, ask for more details. 
                            You would have to convert the user request into a table cantaining 
                            name of items (in Dutch), name of items (in English), and their quantities. 
                            
                            Once you have the specific details, provide the lowest price for the items that the user wants to buy. 
                            You specialize in finding the best prices and deals from local supermarkets in the Netherlands, 
                            including Albert Heijn, ALDI, Jumbo, Lidl, Dirk. 

                            You can receive requests of two kinds:
                            Sometimes the user will give you a recipe/recipes; in that case, you should list down all the groceries required 
                            (this one should be in Dutch) for making that dish(es) for 2 people. In such cases, always produce 
                            a list of ingredients, quantity (in grams, liters, or stuks or other units), and ask the user to confirm.

                            Sometimes the user will give an item/ a list of items; in that case, ask specific questions about quantity/brand preference etc.
                            create a table of ingredients (in dutch), ingredients (in english), (in grams, liters, or stuks or other units), and ask the user to confirm.

                            In both cases the table header should be in English. If there are changes, accommodate that through conversation.
                            Wait for the user to confirm the ingredients. 
                            Respond in english and strictly use markdown format for the response so that it's easy to parse."""
        
    
    def gen_agent_instruction(self):
        return [SystemMessage(
            content=f"""Here are some general instructions for you:
                        {self.instructions} """
        )]
    
    def gen_product_finder_agent_instruction(self):
        return 
    
    def get_session_id(self):
        return self.session_id
    
    async def get_response(self, new_chat):
        await self.update_chat_human(HumanMessage(content=new_chat['value']))
        agent_response = await self.model.ainvoke(self.gen_agent_instruction() + self.chat_queue)
        print(self.chat_queue)

    async def get_std_category(self, product_name):
        agent_request = f"You are a data operator. I want you to take a product_name as " \
                "input and give me which standard category (given) it belongs to. " \
                "Just give me the most appropriate standard category and nothing more as response: " \
                "Here is the product name: " + product_name + \
                " Here are the standard Categories: " + grocery_categories
        
        agent_response = await self.model.ainvoke(agent_request)
        print(agent_response.content)
        return agent_response.content

        # # New prompt for receipe
        # parser = JsonOutputParser(pydantic_object=GroceryList)

        # prompt = PromptTemplate(
        #     template="You are a product helper agent. Your job is to take a the chat history as input"+
        #       "and provide a grocery list as output. Format your response as a JSON object with the following schema: \n{format_instructions}\n" +
        #       "Here is the input list of groceries/receipe from the user: \n{query}\n",
        #     input_variables=["query"],
        #     partial_variables={"format_instructions": parser.get_format_instructions()},
        # )

        # chain = prompt | self.model | parser

        # response =  await chain.ainvoke({"query": new_chat['value']})
        # print(response)

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