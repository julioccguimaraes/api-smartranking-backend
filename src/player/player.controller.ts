import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddPlayerDto } from './dtos/add-player.dto';
import { UpdatePlayerDto } from './dtos/update-player-dto';
import { Player } from './interfaces/player.interface';
import { ValidationParamPipe } from '../common/pipes/validation-param.pipe';
import { PlayerService } from './player.service';

@Controller('api/v1/player')
export class PlayerController {

    constructor(private readonly playerService: PlayerService) { }

    private readonly logger = new Logger(PlayerController.name)

    @Post()
    @UsePipes(ValidationPipe) // decorators em class-validation no dto
    async addPlayer(@Body() addPlayerDto: AddPlayerDto): Promise<Player> {
        return await this.playerService.addPlayer(addPlayerDto)
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe) // decorators em class-validation no dto
    async updatePlayer(
        @Body() updatePlayerDto: UpdatePlayerDto,
        @Param('_id', ValidationParamPipe) _id: string): Promise<Player> {
        return await this.playerService.updatePlayer(_id, updatePlayerDto)
    }

    @Get()
    async getPlayers(@Query('idPlayer') _id: string): Promise<Player[] | Player> {
        
        if (_id) {
            return await this.playerService.getPlayerById(_id);
        }

        return await this.playerService.getPlayers()
    }

    @Delete('/:_id')
    async deletePlayer(@Param('_id', ValidationParamPipe) _id: string): Promise<void> {
        await this.playerService.deletePlayer(_id)
    }
}
