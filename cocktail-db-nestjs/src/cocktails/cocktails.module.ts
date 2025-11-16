import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cocktail } from './cocktail.entity';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cocktail])],
  controllers: [CocktailsController],
  providers: [CocktailsService],
})
export class CocktailsModule {}
