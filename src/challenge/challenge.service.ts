import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import { PlayerService } from 'src/player/player.service';
import { AddChallengeDto } from './dtos/add-challenge.dto';
import { ChallengeToMatchDto } from './dtos/challenge-to-match.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge, Match } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challenge.status.enum';

@Injectable()
export class ChallengeService {
    constructor(
        @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
        @InjectModel('Match') private readonly matchModel: Model<Match>,
        private readonly playerService: PlayerService,
        private readonly categoryService: CategoryService) { }

    private readonly logger = new Logger(ChallengeService.name)

    async addChallenge(addChallengeDto: AddChallengeDto): Promise<Challenge> {

        // Verificar se os jogadores informados estão cadastrados

        const players = await this.playerService.getPlayers()

        addChallengeDto.players.map(playerDto => {
            const playerFilter = players.filter(player => player._id == playerDto._id)

            if (playerFilter.length == 0) {
                throw new BadRequestException(`O id ${playerDto._id} não é um jogador!`)
            }

        })

        // Verificar se o solicitante é um dos jogadores da partida

        const requesterIsPlayerOfMatch = addChallengeDto.players.filter(player => player._id == addChallengeDto.requester)

        this.logger.log(`requesterIsPlayerOfMatch: ${requesterIsPlayerOfMatch}`)

        if (requesterIsPlayerOfMatch.length == 0) {
            throw new BadRequestException(`O solicitante deve ser um jogador da partida!`)
        }

        // Descobrimos a categoria com base no ID do jogador solicitante

        const playerCategory = await this.categoryService.getCategoryByPlayer(addChallengeDto.requester)

        // Para prosseguir o solicitante deve fazer parte de uma categoria

        if (!playerCategory) {
            throw new BadRequestException(`O solicitante precisa estar registrado em uma categoria!`)
        }

        const challengeCreated = new this.challengeModel(addChallengeDto)
        challengeCreated.category = playerCategory.category
        challengeCreated.dateHourRequest = new Date()

        // Quando um desafio for criado, definimos o status desafio como pendente

        challengeCreated.status = ChallengeStatus.PENDENTE

        this.logger.log(`challengeCreated: ${JSON.stringify(challengeCreated)}`)

        return await challengeCreated.save()
    }

    async getChallenges(): Promise<Array<Challenge>> {
        return await this.challengeModel.find()
            .populate("requester")
            .populate("players")
            .populate("match")
            .exec()
    }

    async getChallangesPlayer(_id: any): Promise<Array<Challenge>> {

        const players = await this.playerService.getPlayers()

        const playerFilter = players.filter(player => player._id == _id)

        if (playerFilter.length == 0) {
            throw new BadRequestException(`O id ${_id} não é um jogador!`)
        }

        return await this.challengeModel.find()
            .where('players')
            .in(_id)
            .populate("requester")
            .populate("players")
            .populate("match")
            .exec()
    }

    async updateChallenge(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {

        const findChallenge = await this.challengeModel.findById(_id).exec()

        if (!findChallenge) {
            throw new NotFoundException(`Challenge ${_id} não cadastrado!`)
        }

        // Atualizaremos a data da resposta quando o status do desafio vier preenchido 

        if (updateChallengeDto.status) {
            findChallenge.dateHourResponse = new Date()
        }
        findChallenge.status = updateChallengeDto.status
        findChallenge.dateHourChallenge = updateChallengeDto.dateHourChallenge

        await this.challengeModel.findOneAndUpdate({ _id }, { $set: findChallenge }).exec()
    }

    async setChallengeToMatch(_id: string, challengeToMatchDto: ChallengeToMatchDto): Promise<void> {

        const findChallenge = await this.challengeModel.findById(_id).exec()

        if (!findChallenge) {
            throw new BadRequestException(`Challenge ${_id} não cadastrado!`)
        }

        // Verificar se o jogador vencedor faz parte do desafio

        const playerFilter = findChallenge.players.filter(player => player._id == challengeToMatchDto.def)

        this.logger.log(`findChallenge: ${findChallenge}`)
        this.logger.log(`playerFilter: ${playerFilter}`)

        if (playerFilter.length == 0) {
            throw new BadRequestException(`O jogador vencedor não faz parte do desafio!`)
        }

        //Primeiro vamos criar e persistir o objeto partida
        const addMatch = new this.matchModel(challengeToMatchDto)

        //Atribuir ao objeto partida a categoria recuperada no desafio
        addMatch.category = findChallenge.category

        //Atribuir ao objeto partida os jogadores que fizeram parte do desafio
        addMatch.players = findChallenge.players

        const result = await addMatch.save()

        /*
        Quando uma partida for registrada por um usuário, mudaremos o 
        status do desafio para realizado
        */
        findChallenge.status = ChallengeStatus.REALIZADO

        //Recuperamos o ID da partida e atribuimos ao desafio
        findChallenge.match = result._id

        try {
            await this.challengeModel.findOneAndUpdate({ _id }, { $set: findChallenge }).exec()
        } catch (error) {
            /*
            Se a atualização do desafio falhar excluímos a partida 
            gravada anteriormente
            */
            await this.matchModel.deleteOne({ _id: result._id }).exec();
            throw new InternalServerErrorException()
        }
    }

    async deleteChallenge(_id: string): Promise<void> {

        const findChallenge = await this.challengeModel.findById(_id).exec()

        if (!findChallenge) {
            throw new BadRequestException(`Challenge ${_id} não cadastrado!`)
        }

        /*
        Realizaremos a deleção lógica do desafio, modificando seu status para
        CANCELADO
        */
        findChallenge.status = ChallengeStatus.CANCELADO

        await this.challengeModel.findOneAndUpdate({ _id }, { $set: findChallenge }).exec()

    }
}
