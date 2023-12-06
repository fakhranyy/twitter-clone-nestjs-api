import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { ArticleService } from 'src/article/article.service';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';
import { Follow } from 'src/profile/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Article, Follow])],
  controllers: [CommentController],
  providers: [CommentService, ArticleService ],
})
export class CommentModule {}
