import express from 'express';
import cors from 'cors';
import pokemonRoutes from './modules/pokemons/pokemon-route';
import { initializeDatabase } from './utils/db';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use('/', pokemonRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a PokeAPI!',
    endpoints: {
      'GET /pokemon': 'Obtener todos los pokémon',
      'GET /pokemon/id/:id': 'Obtener pokémon por ID',
      'GET /pokemon/name/:name': 'Obtener pokémon por nombre',
      'GET /pokemon/type/:type': 'Obtener pokémon por tipo',
      'POST /pokemon': 'Crear nuevo pokémon',
      'PUT /pokemon/:id': 'Actualizar pokémon',
      'DELETE /pokemon/:id': 'Eliminar pokémon'
    }
  });
});

// Inicializar base de datos y servidor
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running in http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();