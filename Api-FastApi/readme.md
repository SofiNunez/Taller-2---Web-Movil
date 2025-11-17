# 🍽️ Meals API (FastAPI + PostgreSQL + TheMealDB)

API desarrollada para el **Taller 2**, utilizando **FastAPI**, **PostgreSQL** y **TheMealDB** como fuente externa.  
El objetivo es replicar los endpoints principales de TheMealDB, pero usando nuestra propia base de datos local y sincronización automática.

---

## ✨ Características principales

- Backend desarrollado en **Python + FastAPI**
- Base de datos **PostgreSQL**
- Sincronización automática desde **TheMealDB**
- Endpoints totalmente compatibles con la API original:
  - `/search.php?s=...`
  - `/lookup.php?i=...`
- La API busca primero en la BD → si no existe, consulta TheMealDB y guarda los resultados.
- Documentación automática en `/docs`

---

# 📦 Tecnologías Utilizadas

- Python 3.9+
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic v2
- httpx
- Uvicorn
- python-dotenv

---

# 📁 Estructura del Proyecto

taller2/
├─ main.py
├─ models.py
├─ schemas.py
├─ database.py
├─ create_db.py
├─ .env
└─ README.md

python3 -m venv venv
source venv/bin/activate

python3 -m pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary httpx python-dotenv

Configuración de PostgreSQL
Crear archivo .env en la raíz del proyecto:
DATABASE_URL=postgresql://postgres:123@localhost:5432/meals_db


python3 create_db.py

Ejecutar la API
python3 -m uvicorn main:app --reload

http://localhost:8000

http://localhost:8000/docs


Endpoints Disponibles
1. Buscar comidas por nombre
GET /search.php?s=<nombre>
Ejemplo:
http://localhost:8000/search.php?s=chicken
Funcionamiento:
Busca en PostgreSQL
Si no encuentra, consulta TheMealDB
Guarda el resultado en la BD
Devuelve los datos en el mismo formato que TheMealDB
2. Buscar comida por ID
GET /lookup.php?i=<id>
Ejemplo:
http://localhost:8000/lookup.php?i=52772
Funcionamiento:
Busca el ID en la BD
Si no está, lo obtiene desde TheMealDB
Lo guarda en PostgreSQL
Devuelve un arreglo "meals" igual al original