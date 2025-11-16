import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cocktail } from './cocktails/cocktail.entity';
import { CocktailsModule } from './cocktails/cocktails.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cocktails.db',
      synchronize: true,
      entities: [Cocktail],
    }),

    CocktailsModule,
  ],
})
export class AppModule {}
