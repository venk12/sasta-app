import json
from typing import List, Optional, Dict
import pandas as pd
from pydantic import BaseModel, Field, field_validator

class GroceryList(BaseModel):

    # response: str = Field(description="Just respond the user response in a funny way.")
    groceries: List[Dict[str, str]] = Field(
        description=(
            "A list of dictionaries containing ingredients (product name in Dutch) and quantity confirmed by the user. "+
            "Dict key is ingredient (in dutch), value is quantity. The list contains all the ingredients "+
            "needed to make the receipe/grocery list"
        )
    )
    # call_to_action: Optional[int] = Field(description="what should the user do next?")
