import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';

@Module({
  imports: [
    TagModule,
    // ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
  ], // should import it to let me use config vars in database module
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
