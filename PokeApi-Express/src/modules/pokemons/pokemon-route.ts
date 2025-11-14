import { Router } from 'express';
import { PokemonService } from './pokemon-service';

const router = Router();
const pokemonController = new PokemonService();

// Rutas principales
router.get('/pokemon', (req: any, res: any) => pokemonController.getAll(req, res));
router.get('/pokemon/id/:id', (req: any, res: any) => pokemonController.getById(req, res));
router.get('/pokemon/name/:name', (req: any, res: any) => pokemonController.getByName(req, res));
router.get('/pokemon/type/:type', (req: any, res: any) => pokemonController.getByType(req, res));
router.post('/pokemon', (req: any, res: any) => pokemonController.create(req, res));
router.put('/pokemon/:id', (req: any, res: any) => pokemonController.update(req, res));
router.delete('/pokemon/:id', (req: any, res: any) => pokemonController.delete(req, res));

export default router;