import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TagModule, DatabaseModule, ConfigModule.forRoot()], // should import it to let me use config vars in database module
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
