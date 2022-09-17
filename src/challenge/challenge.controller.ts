import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { AddChallengeDto } from './dtos/add-challenge.dto';
import { ChallengeToMatchDto } from './dtos/challenge-to-match.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenge')
export class ChallengeController {

    constructor(private readonly challengeService: ChallengeService) { }

    private readonly logger = new Logger(ChallengeController.name)

    @Post()
    @UsePipes(ValidationPipe)
    async addChallenge(
        @Body() addChallengeDto: AddChallengeDto): Promise<Challenge> {
        this.logger.log(`addChallengeDto: ${JSON.stringify(addChallengeDto)}`)
        return await this.challengeService.addChallenge(addChallengeDto)
    }

    @Get()
    async getChallenges(
        @Query('idPlayer') _id: string): Promise<Array<Challenge>> {
        return _id ? await this.challengeService.getChallangesPlayer(_id)
            : await this.challengeService.getChallenges()
    }

    @Put('/:challenge')
    async updateChallenge(
        @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
        @Param('challenge') _id: string): Promise<void> {
        await this.challengeService.updateChallenge(_id, updateChallengeDto)

    }

    @Post('/:challenge/match/')
    async setChallengeToMatch(
        @Body(ValidationPipe) challengeToMatchDto: ChallengeToMatchDto,
        @Param('challenge') _id: string): Promise<void> {
        return await this.challengeService.setChallengeToMatch(_id, challengeToMatchDto)
    }

    @Delete('/:_id')
    async deleteChallenge(
        @Param('_id') _id: string): Promise<void> {
        await this.challengeService.deleteChallenge(_id)
    }

}
