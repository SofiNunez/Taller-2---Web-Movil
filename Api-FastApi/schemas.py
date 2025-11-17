from pydantic import BaseModel, ConfigDict
from typing import Optional

class MealBase(BaseModel):
    id: int
    name: str
    category: Optional[str] = None
    area: Optional[str] = None
    instructions: Optional[str] = None
    thumbnail: Optional[str] = None
    tags: Optional[str] = None
    youtube: Optional[str] = None
    source: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MealList(BaseModel):
    meals: list[MealBase]
