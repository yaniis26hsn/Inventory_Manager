import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
  entities:[User]
})
export class AppModule {}
