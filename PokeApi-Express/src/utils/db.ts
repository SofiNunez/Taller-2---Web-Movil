import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pokeapi',
  password: 'pokemon123', 
  port: 5432,
});

export const initializeDatabase = async () => {
  try {
    // Crear tabla
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pokemons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type1 VARCHAR(50) NOT NULL,
        type2 VARCHAR(50),
        height DECIMAL(5,2) NOT NULL,
        weight DECIMAL(6,2) NOT NULL,
        hp INTEGER NOT NULL,
        attack INTEGER NOT NULL,
        defense INTEGER NOT NULL,
        speed INTEGER NOT NULL,
        image_url TEXT
      );
    `);

    const { rows } = await pool.query('SELECT COUNT(*) FROM pokemons');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO pokemons (name, type1, type2, height, weight, hp, attack, defense, speed, image_url) VALUES
        ('Bulbasaur', 'Grass', 'Poison', 0.7, 6.9, 45, 49, 49, 45, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'),
        ('Charmander', 'Fire', NULL, 0.6, 8.5, 39, 52, 43, 65, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'),
        ('Squirtle', 'Water', NULL, 0.5, 9.0, 44, 48, 65, 43, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png'),
        ('Pikachu', 'Electric', NULL, 0.4, 6.0, 35, 55, 40, 90, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'),
        ('Jigglypuff', 'Normal', 'Fairy', 0.5, 5.5, 115, 45, 20, 20, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png'),
        ('Meowth', 'Normal', NULL, 0.4, 4.2, 40, 45, 35, 90, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png'),
        ('Psyduck', 'Water', NULL, 0.8, 19.6, 50, 52, 48, 55, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png'),
        ('Machop', 'Fighting', NULL, 0.8, 19.5, 70, 80, 50, 35, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png'),
        ('Geodude', 'Rock', 'Ground', 0.4, 20.0, 40, 80, 100, 20, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png'),
        ('Eevee', 'Normal', NULL, 0.3, 6.5, 55, 55, 50, 55, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png');
      `);
      console.log('Base de datos inicializada con 10 Pokémon');
    }
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
};