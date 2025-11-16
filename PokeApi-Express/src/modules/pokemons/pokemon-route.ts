import { Router } from "express";
import { PokemonService } from "./pokemon-service";
import { Pokemon, PokemonCreate } from "./pokemon-model";

const router = Router();
const pokemonService = new PokemonService();

// Rutas principales
/**
 *
 */
router.get("/pokemon", async (req: any, res: any) => {
  try {
    const pokemons = await pokemonService.getAll();
    res.json({
      count: pokemons.length,
      results: pokemons,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el Pokémon" });
  }
});

router.get("/pokemon/id/:id", async (req: any, res: any) => {
    try {
      const {id} = req.params
      const pokemon = await pokemonService.getById(id);

      if (pokemon === null) {
         res.status(404).json({ error: 'Pokémon no encontrado' });
         return;
      }
       res.json(pokemon);
     } catch (error) {
       res.status(500).json({ error: 'Error al obtener el Pókemon' });
     } 
});

router.get("/pokemon/name/:name", async (req: any, res: any) => {
    try {
      const { name } = req.params;
      const pokemon = await pokemonService.getByName(name);

      if (pokemon === null) {
        res.status(404).json({ error: 'Pokémon no encontrado' });
        return;
      }
        
      res.json(pokemon);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el Pokémon' });
      }
});

router.get("/pokemon/type/:type", async (req: any, res: any) => {
    try {
      const { type } = req.params;
      const pokemon = await pokemonService.getByType(type);

      if (pokemon === null) {
              res.status(404).json({ error: 'Pokémon no encontrado' });
              return;
      }
            
      res.json(pokemon);
      } catch (error) {
          res.status(500).json({ error: 'Error al obtener el Pokémon' });
      }
});

//Ruta para crear un pokémon
router.post('/pokemon', async (req: any, res: any) => {
  try {
    const pokemonData: PokemonCreate = req.body;
    const exist = await pokemonService.getByName(pokemonData.name)
    
    if (exist) {
      res.status(409).json({ error: 'Ya existe un pokémon con el nombre "${pokemonData.name}"'});
      return;
    }
    
    const newPokemon = await pokemonService.create(pokemonData);
    res.status(201).json(newPokemon);

  } catch (error) {
    console.error('Error al crear pokémon:', error);
    res.status(500).json({ error: 'Error al crear Pokémon' });
  }
});

router.put("/pokemon/:id", (req: any, res: any) =>
  pokemonService.update(req, res)
);

router.delete("/pokemon/:id", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const rowCount = await pokemonService.delete(id);
      
      if (rowCount === 0) {
        res.status(404).json({ error: 'Pokémon no encontrado' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el Pokémon' });
    }
  }
);

export default router;
