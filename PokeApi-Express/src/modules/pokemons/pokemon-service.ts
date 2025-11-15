// src/controllers/pokemon.controller.ts
import { Request, Response } from 'express';
import { pool } from '../../utils/db';
import { Pokemon, PokemonCreate } from './pokemon-model';

export class PokemonService {
  // Obtener todos los pokémon
  async getAll(): Promise<Pokemon[]> {
    const { rows } = await pool.query<Pokemon>(
      'SELECT * FROM pokemons ORDER BY id'
    );

    return rows;
  }

  // Obtener un pokémon por ID
  async getById(id: number): Promise<Pokemon | null> {
      const { rows } = await pool.query<Pokemon>(
        'SELECT * FROM pokemons WHERE id = $1',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }

      else {
        return rows[0]
      }
  }

  // Obtener un pokémon por nombre
  async getByName(name: string): Promise<Pokemon | null> {
      const { rows } = await pool.query<Pokemon>(
        'SELECT * FROM pokemons WHERE LOWER(name) = LOWER($1)',
        [name]
      );

      if (rows.length === 0) {
        return null;
      }

      else {
        return rows[0]
      }
  }

  // Buscar pokémon por tipos
  async getByType(type: string): Promise<Pokemon[]> {
    const { rows } = await pool.query<Pokemon>(
      'SELECT * FROM pokemons WHERE LOWER(type1) = LOWER($1) OR LOWER(type2) = LOWER($1)',
      [type]
    );
    return rows;
  }

  // Crear un nuevo pokémon
  async create(pokemon: PokemonCreate): Promise<Pokemon> {
    const { rows } = await pool.query<Pokemon>(
      `INSERT INTO pokemons (name, type1, type2, height, weight, hp, attack, defense, speed, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        pokemon.name,
        pokemon.type1,
        pokemon.type2 || null,
        pokemon.height,
        pokemon.weight,
        pokemon.hp,
        pokemon.attack,
        pokemon.defense,
        pokemon.speed,
        pokemon.image_url || null
      ]
    );
    return rows[0];
  }

  // Actualizar un pokémon
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pokemon: Partial<PokemonCreate> = req.body;
      
      const { rows } = await pool.query<Pokemon>(
        `UPDATE pokemons 
         SET name = COALESCE($1, name),
             type1 = COALESCE($2, type1),
             type2 = COALESCE($3, type2),
             height = COALESCE($4, height),
             weight = COALESCE($5, weight),
             hp = COALESCE($6, hp),
             attack = COALESCE($7, attack),
             defense = COALESCE($8, defense),
             speed = COALESCE($9, speed),
             image_url = COALESCE($10, image_url)
         WHERE id = $11
         RETURNING *`,
        [
          pokemon.name,
          pokemon.type1,
          pokemon.type2,
          pokemon.height,
          pokemon.weight,
          pokemon.hp,
          pokemon.attack,
          pokemon.defense,
          pokemon.speed,
          pokemon.image_url,
          id
        ]
      );
      
      if (rows.length === 0) {
        res.status(404).json({ error: 'Pokémon no encontrado' });
        return;
      }
      
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar pokémon' });
    }
  }

  // Eliminar un pokémon
  async delete(id:number): Promise<number | null> {
      const result = await pool.query(
        'DELETE FROM pokemons WHERE id = $1',
        [id]
      );

      if (result.rowCount === 0) {
        return null;
      }

      else {
        return result.rowCount;
      }
  }
}