import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerService } from 'src/player/player.service';
import { AddCategoryDto } from './dtos/add-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        private readonly playerService: PlayerService
    ) { }

    async addCategory(addCategoryDto: AddCategoryDto): Promise<Category> {
        const { category } = addCategoryDto

        const findCategory = await this.categoryModel.findOne({ category }).exec()

        if (findCategory) {
            throw new BadRequestException("Categoria já cadastrada!")
        }

        return await new this.categoryModel(addCategoryDto).save()
    }

    async getCategories(): Promise<Array<Category>> {
        return await this.categoryModel.find().populate('players').exec() // populate exibe as categorias com os as informações dos jogadores relacionados e não só o ID
    }

    async getCategoryById(_id: string): Promise<Category> {
        const findCategory = await this.categoryModel.findOne({ _id }).exec()

        if (!findCategory) {
            throw new NotFoundException("Categoria não encontrada!")
        }

        return findCategory
    }

    async updateCategory(_id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const findCateogory = await this.categoryModel.findOne({ _id }).exec()

        if (!findCateogory) {
            throw new NotFoundException("Categoria não encontrado!")
        }

        return await this.categoryModel.findByIdAndUpdate({ _id }, { $set: updateCategoryDto }, { new: true }).exec()
    }

    async categoryToPlayer(params: string[]): Promise<void> {
        const idCategory = params['idCategory']
        const idPlayer = params['idPlayer']

        /*
        if (!idPlayer.match(/^[0-9a-fA-F]{24}$/)) { // verifica se é um id válido para mongoDB
            throw new NotFoundException("Jogador não existe!")
        }*/

        const findCategory = await this.categoryModel.findOne({ idCategory }).exec()

        // procure na categoria informada um jogadodor informado na estrutura players (campo players)
        const findPlayerInCategory = await this.categoryModel.find({ idCategory }).where('players').in(idPlayer).exec()

        // verificar se o jogador existe
        // para usar o playerService aqui, tem de exportar o PlayerService no módulo do Player
        // depois importar o PlayerModule no CategoryModule
        // fazer a injeção de dependencia no contrutor de CategoryService
        const players = await this.playerService.getPlayers()

        const playerFilter = players.filter( player => player._id == idPlayer )

        if (playerFilter.length == 0) {
            throw new BadRequestException(`O id ${idPlayer} não é um jogador!`)
        }

        if (!findCategory) { // verifica se é um id válido para mongoDB
            throw new NotFoundException("Categoria não existe!")
        }

        if (findPlayerInCategory.length > 0) {
            throw new BadRequestException("O jogador já está cadastrado na categoria!")
        }

        findCategory.players.push(idPlayer)

        await this.categoryModel.findOneAndUpdate({ idCategory }, { $set: findCategory }).exec()
    }

    async getCategoryByPlayer(idPlayer: any): Promise<Category> {

        const players = await this.playerService.getPlayers()

        const playerFilter = players.filter(player => player._id == idPlayer)

        if (playerFilter.length == 0) {
            throw new BadRequestException(`O id ${idPlayer} não é um jogador!`)
        }

        return await this.categoryModel.findOne().where('players').in(idPlayer).exec()

    }

}
