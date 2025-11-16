import { Controller, Get, Param, Query, Post, Body, Delete } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';

@Controller('cocktails')
export class CocktailsController {
  constructor(private service: CocktailsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.service.search(name);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  // 🔥 EL NUEVO ENDPOINT DELETE
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
