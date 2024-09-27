import random
import string

def generate_random_session_id(length=6):
    letters = string.ascii_letters  # This includes both lowercase and uppercase letters
    return ''.join(random.choice(letters) for _ in range(length))

async def generate_session_obj(session_id):
    response = {"key": "session_id", "value": session_id}
    return response

async def generate_main_agent_response_obj(response):
    return {"key": "chat", "value": response}