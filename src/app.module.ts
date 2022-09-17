import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }),
    PlayerModule,
    CategoryModule,
    ChallengeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
