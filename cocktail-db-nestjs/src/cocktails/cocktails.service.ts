import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Cocktail } from './cocktail.entity';

@Injectable()
export class CocktailsService {
  constructor(
    @InjectRepository(Cocktail)
    private repo: Repository<Cocktail>
  ) {}

  findAll() {
    return this.repo.find();
  }

  async delete(id: number) {
   return this.repo.delete(id);
  }


  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  search(name: string) {
    return this.repo.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  create(data: Partial<Cocktail>) {
    const cocktail = this.repo.create(data);
    return this.repo.save(cocktail);
  }
}
