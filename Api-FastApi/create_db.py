from database import Base, engine
from models import Meal

Base.metadata.create_all(bind=engine)
print("Tablas creadas ✅")
