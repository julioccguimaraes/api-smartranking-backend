import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from 'src/category/category.module';
import { PlayerModule } from 'src/player/player.module';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { MatchSchema } from './interfaces/match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Challenge', schema: ChallengeSchema},
      {name: 'Match', schema: MatchSchema}]),
    PlayerModule,
    CategoryModule],

  controllers: [ChallengeController],
  providers: [ChallengeService]
})
export class ChallengeModule {}
