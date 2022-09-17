import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AddPlayerDto } from './dtos/add-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player-dto';

@Injectable()
export class PlayerService {
    constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) { }

    private readonly logger = new Logger(PlayerService.name)

    async addPlayer(addPlayerDto: AddPlayerDto): Promise<Player> {
        const { email } = addPlayerDto

        const findPlayer = await this.playerModel.findOne({ email }).exec()

        if (findPlayer) {
            throw new BadRequestException("Jogador já possui o e-mail cadastrado!")
        }

        const playerAdded = new this.playerModel(addPlayerDto)
        return await playerAdded.save()
    }

    async updatePlayer(_id: string, updatedPlayerDto: UpdatePlayerDto): Promise<Player> {
        const findPlayer = await this.playerModel.findOne({ _id }).exec()

        if (!findPlayer) {
            throw new NotFoundException("Jogador não encontrado!")
        }

        return await this.playerModel.findByIdAndUpdate({ _id }, { $set: updatedPlayerDto }, { new: true }).exec()
    }

    async getPlayers(): Promise<Player[]> {
        return await this.playerModel.find().exec()
    }

    async getPlayerById(_id: string): Promise<Player> {
        const findPlayer = await this.playerModel.findOne({ _id }).exec()

        if (!findPlayer) {
            throw new NotFoundException("Jogador não encontrado!")
        }

        return findPlayer
    }

    async deletePlayer(_id: string): Promise<any> {
        return await this.playerModel.deleteOne({ _id }).exec()
    }
}
