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

async def map_std_category(product_name):
    # classify the 
    pass


grocery_categories = f"""
Aardappel, groente, fruit
Salades, pizza, maaltijden
Vlees, vis
Vegetarisch, vegan en plantaardig
Kaas, vleeswaren, tapas
Zuivel, eieren, boter
Bakkerij
Ontbijtgranen en beleg
Chips, noten, toast, popcorn
Snoep, chocolade, koek
Tussendoortjes
Koffie, thee
Frisdrank, sappen, siropen, water
Wijn en bubbels
Bier en aperitieven
Pasta, rijst en wereldkeuken
Soepen, sauzen, kruiden, olie
Diepvries
Drogisterij
Gezondheid, sport
Baby en kind
Huishouden
Huisdier
Koken, tafelen, vrije tijd
"""
