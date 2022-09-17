import { IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize, IsDateString } from 'class-validator';
import { Player } from 'src/player/interfaces/player.interface';

export class AddChallengeDto {
    @IsNotEmpty()
    @IsDateString()
    dateHourChallenge: Date;

    @IsNotEmpty()
    requester: Player;

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    players: Array<Player>
}
