const API_BASE = "http://localhost:8000";

const formSearch = document.getElementById("formSearch");
const formLookup = document.getElementById("formLookup");
const inputName = document.getElementById("searchName");
const inputId = document.getElementById("searchId");
const btnSync = document.getElementById("btnSync");
const btnClear = document.getElementById("btnClear");
const statusSearch = document.getElementById("statusSearch");
const statusLookup = document.getElementById("statusLookup");
const resultsContainer = document.getElementById("results");
const noResults = document.getElementById("noResults");


function setStatus(element, message, type = "info") {
  element.textContent = message || "";
  element.className = "status";

  if (type === "error") {
    element.classList.add("error");
  } else if (type === "success") {
    element.classList.add("success");
  }
}


function clearResults() {
  resultsContainer.innerHTML = "";
  noResults.classList.add("hidden");
  setStatus(statusSearch, "");
  setStatus(statusLookup, "");
}


function renderMeals(meals) {
  resultsContainer.innerHTML = "";

  if (!meals || meals.length === 0) {
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");

  meals.forEach((meal) => {
    const card = document.createElement("article");
    card.className = "card";

    const header = document.createElement("div");
    header.className = "flex gap-3";

    const img = document.createElement("img");
    img.src = meal.thumbnail || meal.strMealThumb || "";
    img.alt = meal.name || meal.strMeal || "Meal image";
    img.className = "card-img";

    const info = document.createElement("div");
    info.className = "flex-1";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = meal.name || meal.strMeal || "Sin nombre";

    const meta = document.createElement("p");
    meta.className = "card-meta";
    const cat = meal.category || meal.strCategory || "Sin categoría";
    const area = meal.area || meal.strArea || "Sin área";
    meta.textContent = `${cat} • ${area}`;

    const tags = document.createElement("p");
    tags.className = "card-tags";
    if (meal.tags || meal.strTags) {
      tags.textContent = "Tags: " + (meal.tags || meal.strTags);
    }

    info.appendChild(title);
    info.appendChild(meta);
    if (tags.textContent) {
      info.appendChild(tags);
    }

    header.appendChild(img);
    header.appendChild(info);

    const instructions = document.createElement("p");
    instructions.className = "card-text";
    instructions.textContent =
      meal.instructions || meal.strInstructions || "Sin instrucciones.";

    card.appendChild(header);
    card.appendChild(instructions);

    
    if (meal.youtube || meal.strYoutube || meal.source || meal.strSource) {
      const links = document.createElement("div");
      links.className = "card-links";

      if (meal.youtube || meal.strYoutube) {
        const aYt = document.createElement("a");
        aYt.href = meal.youtube || meal.strYoutube;
        aYt.target = "_blank";
        aYt.className = "card-link";
        aYt.style.color = "#dc2626"; // rojo
        aYt.textContent = "Ver en YouTube";
        links.appendChild(aYt);
      }

      if (meal.source || meal.strSource) {
        const aSrc = document.createElement("a");
        aSrc.href = meal.source || meal.strSource;
        aSrc.target = "_blank";
        aSrc.className = "card-link";
        aSrc.style.color = "#2563eb"; // azul
        aSrc.textContent = "Fuente";
        links.appendChild(aSrc);
      }

      card.appendChild(links);
    }

    resultsContainer.appendChild(card);
  });
}


async function searchMeals(sync = false) {
  const name = inputName.value.trim();
  if (!name) {
    setStatus(statusSearch, "Ingresa un nombre para buscar.", "error");
    return;
  }

  clearResults();
  setStatus(
    statusSearch,
    sync ? "Sincronizando con TheMealDB y buscando..." : "Buscando comidas..."
  );

  try {
    
    if (sync) {
      const syncURL = `${API_BASE}/meals/sync?name=${encodeURIComponent(name)}`;
      const resSync = await fetch(syncURL, { method: "POST" });
      if (!resSync.ok) {
        throw new Error("Error al sincronizar: " + resSync.status);
      }
      await resSync.json();
    }

    
    const url = `${API_BASE}/search.php?s=${encodeURIComponent(name)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Error en la búsqueda: " + res.status);
    }

    const data = await res.json();
    renderMeals(data.meals);
    const count = data.meals ? data.meals.length : 0;
    setStatus(
      statusSearch,
      count > 0 ? `Se encontraron ${count} resultados.` : "No se encontraron resultados.",
      count > 0 ? "success" : "info"
    );
  } catch (error) {
    console.error(error);
    setStatus(
      statusSearch,
      "Ocurrió un error al buscar. Revisa la consola.",
      "error"
    );
  }
}


async function lookupMeal() {
  const id = inputId.value.trim();
  if (!id) {
    setStatus(statusLookup, "Ingresa un ID válido.", "error");
    return;
  }

  clearResults();
  setStatus(statusLookup, "Buscando por ID...");

  try {
    const url = `${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Error en la búsqueda: " + res.status);
    }

    const data = await res.json();
    renderMeals(data.meals);

    const found = data.meals && data.meals.length > 0;
    setStatus(
      statusLookup,
      found
        ? "Comida encontrada y cargada desde tu API."
        : "No se encontró ninguna comida con ese ID.",
      found ? "success" : "info"
    );
  } catch (error) {
    console.error(error);
    setStatus(
      statusLookup,
      "Ocurrió un error al buscar por ID. Revisa la consola.",
      "error"
    );
  }
}


formSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  searchMeals(false);
});

btnSync.addEventListener("click", () => {
  searchMeals(true);
});

formLookup.addEventListener("submit", (e) => {
  e.preventDefault();
  lookupMeal();
});

btnClear.addEventListener("click", () => {
  inputName.value = "";
  inputId.value = "";
  clearResults();
});
