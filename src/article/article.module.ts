import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleController } from './article.controller';
import { User } from 'src/user/entities/user.entity';
import { Follow } from 'src/profile/entities/follow.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Follow])], //* we use TypeOrmModule.forFeature([Article]) to let us use article as a repo in service class
  controllers: [ArticleController],
  providers: [ArticleService, UserService],
  exports: [ArticleService],
})
export class ArticleModule {}
