export interface Pokemon {
  id: number;
  name: string;
  type1: string;
  type2?: string;
  height: number;
  weight: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  image_url?: string;
}

export interface PokemonCreate {
  name: string;
  type1: string;
  type2?: string;
  height: number;
  weight: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  image_url?: string;
}