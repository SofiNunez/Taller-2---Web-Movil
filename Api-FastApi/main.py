from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from models import Meal
from typing import Optional, List


Base.metadata.create_all(bind=engine)


from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx

from database import Base, engine, get_db
from models import Meal
from schemas import MealBase, MealList

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Meals API (FastAPI + PostgreSQL + TheMealDB)",
    description="API desarrollada para el Taller 2, usando TheMealDB como origen de datos.",
    version="1.0.0",
)

THEMEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1"


# ---------- Funciones auxiliares ----------

def map_themealdb_to_meal_obj(meal_json: dict) -> dict:
    """Mapea el JSON de TheMealDB al formato de nuestro modelo."""
    return {
        "id": int(meal_json["idMeal"]),
        "name": meal_json.get("strMeal"),
        "category": meal_json.get("strCategory"),
        "area": meal_json.get("strArea"),
        "instructions": meal_json.get("strInstructions"),
        "thumbnail": meal_json.get("strMealThumb"),
        "tags": meal_json.get("strTags"),
        "youtube": meal_json.get("strYoutube"),
        "source": meal_json.get("strSource"),
    }


async def fetch_meal_from_themealdb_by_id(meal_id: int) -> Optional[dict]:
    url = f"{THEMEALDB_BASE_URL}/lookup.php?i={meal_id}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()
        meals = data.get("meals")
        if not meals:
            return None
        return meals[0]


async def search_meals_in_themealdb_by_name(name: str) -> List[dict]:
    url = f"{THEMEALDB_BASE_URL}/search.php?s={name}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()
        meals = data.get("meals") or []
        return meals

#---------------





# ---------- Endpoints ----------

@app.get("/meals", response_model=MealList)
def list_meals(name: Optional[str] = None, db: Session = Depends(get_db)):

    """
    Lista comidas desde la BD.
    Si se pasa ?name=..., filtra por nombre (LIKE).
    """
    query = db.query(Meal)
    if name:
        query = query.filter(Meal.name.ilike(f"%{name}%"))
    meals = query.all()
    return {"meals": meals}


@app.get("/meals/{meal_id}", response_model=MealBase)
async def get_meal(meal_id: int, db: Session = Depends(get_db)):
    """
    Obtiene una comida por ID.
    1) Busca en Postgres.
    2) Si no existe, la trae de TheMealDB, la guarda y responde.
    """
    # 1) Buscar en la BD
    meal_db = db.query(Meal).filter(Meal.id == meal_id).first()
    if meal_db:
        return meal_db

    # 2) Buscar en TheMealDB
    meal_json = await fetch_meal_from_themealdb_by_id(meal_id)
    if not meal_json:
        raise HTTPException(status_code=404, detail="Meal not found")

    mapped = map_themealdb_to_meal_obj(meal_json)

    # Guardar en BD
    new_meal = Meal(**mapped)
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)

    return new_meal


@app.post("/meals/sync", response_model=MealList)
async def sync_meals_by_name(name: str, db: Session = Depends(get_db)):
    """
    Busca en TheMealDB por nombre y sincroniza los resultados en Postgres.
    Devuelve la lista de meals guardadas/actualizadas.
    """
    meals_json = await search_meals_in_themealdb_by_name(name)
    if not meals_json:
        raise HTTPException(status_code=404, detail="No meals found in TheMealDB")

    saved_meals: list[Meal] = []

    for m in meals_json:
        mapped = map_themealdb_to_meal_obj(m)
        existing = db.query(Meal).filter(Meal.id == mapped["id"]).first()
        if existing:
            # actualizar campos básicos
            for key, value in mapped.items():
                setattr(existing, key, value)
            db.add(existing)
            saved_meals.append(existing)
        else:
            new_meal = Meal(**mapped)
            db.add(new_meal)
            saved_meals.append(new_meal)

    db.commit()

    # refrescar todos
    for meal in saved_meals:
        db.refresh(meal)

    return {"meals": saved_meals}

from fastapi import Query

@app.get("/search.php")
async def search_meals(s: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """
    Imitación de TheMealDB: /search.php?s=name
    """
    if not s:
        return {"meals": None}

    # 1) Buscar en tu BD
    meals_db = db.query(Meal).filter(Meal.name.ilike(f"%{s}%")).all()

    # 2) Si no hay nada en BD → buscar en TheMealDB y guardar
    if not meals_db:
        meals_json = await search_meals_in_themealdb_by_name(s)
        if not meals_json:
            return {"meals": None}

        saved = []
        for m in meals_json:
            mapped = map_themealdb_to_meal_obj(m)
            meal = Meal(**mapped)
            db.add(meal)
            saved.append(meal)

        db.commit()

        for meal in saved:
            db.refresh(meal)

        return {"meals": saved}

    return {"meals": meals_db}

@app.get("/lookup.php")
async def lookup_meal(i: int = Query(...), db: Session = Depends(get_db)):
    """
    Imitación de TheMealDB: /lookup.php?i=id
    """
    # 1) Primero buscar en tu BD
    meal_db = db.query(Meal).filter(Meal.id == i).first()
    if meal_db:
        return {"meals": [meal_db]}

    # 2) Si no está en BD → buscar en TheMealDB
    meal_json = await fetch_meal_from_themealdb_by_id(i)
    if not meal_json:
        return {"meals": None}

    mapped = map_themealdb_to_meal_obj(meal_json)

    new_meal = Meal(**mapped)
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)

    return {"meals": [new_meal]}


origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
    # Si abres el meals.html con Live Server u otro puerto:
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
