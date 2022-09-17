import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from 'src/category/interfaces/category.schema';
import { PlayerModule } from 'src/player/player.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]), PlayerModule], // PlayerService foi Exportado pelo PlayerModule e pego aqui
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
