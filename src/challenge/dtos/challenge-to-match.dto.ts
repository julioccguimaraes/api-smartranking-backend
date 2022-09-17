import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/player/interfaces/player.interface';
import { Result } from '../interfaces/challenge.interface';

export class ChallengeToMatchDto {

    @IsNotEmpty()
    def: Player

    @IsNotEmpty()
    result: Array<Result>
}
