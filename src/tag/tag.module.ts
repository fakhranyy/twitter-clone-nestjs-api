import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])], // this is to let me use the entity as a repo in srv class
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule {}
