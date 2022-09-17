import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dtos/add-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/category')
export class CategoryController {
    constructor(private readonly categorySevice: CategoryService) { }

    private readonly logger = new Logger(CategoryController.name)

    @Post()
    @UsePipes(ValidationPipe)
    async addCategoy(@Body() addCategoryDto: AddCategoryDto): Promise<Category> {
        return await this.categorySevice.addCategory(addCategoryDto)
    }

    @Get()
    async getCategories(@Query() params: string[]): Promise<Array<Category> | Category> {
        const idCategory = params['idCategory']
        const idPlayer = params['idPlayer']

        if (idCategory) {
            return await this.categorySevice.getCategoryById(idCategory)
        }

        if (idPlayer) {
            return await this.categorySevice.getCategoryByPlayer(idPlayer)
        }

        return await this.categorySevice.getCategories()
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async updateCategory(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Param('_id') _id: string
    ): Promise<Category> {
        return await this.categorySevice.updateCategory(_id, updateCategoryDto)
    }

    @Post('/:idCategory/player/:idPlayer')
    async categoryToPlayer(@Param() params: string[]): Promise<void>{
        await this.categorySevice.categoryToPlayer(params)
    }
}
