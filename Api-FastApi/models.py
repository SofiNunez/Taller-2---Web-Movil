from sqlalchemy import Column, Integer, String, Text
from database import Base

class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)  # idMeal de TheMealDB
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(255), nullable=True)
    area = Column(String(255), nullable=True)
    instructions = Column(Text, nullable=True)
    thumbnail = Column(String(500), nullable=True)
    tags = Column(String(500), nullable=True)      # string con comas
    youtube = Column(String(500), nullable=True)
    source = Column(String(500), nullable=True)
