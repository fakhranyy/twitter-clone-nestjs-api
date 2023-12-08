import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ArticleService } from 'src/article/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Follow } from 'src/profile/entities/follow.entity';
import { Article } from 'src/article/entities/article.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Follow, Article])],
  controllers: [CommentController],
  providers: [CommentService, ArticleService, UserService ],
})
export class CommentModule {}
