import { Injectable, Param } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { ArticleService } from 'src/article/article.service';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly artSrv: ArticleService,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly userSrv: UserService
  ) {}
  async createComment(
    createCommentDto: CreateCommentDto,
    //! currentUserId: User,
     username: string,
    slug: string,
  ): Promise<Comment> {
    const comments = new Comment();
    const user = await this.userSrv.findOne(username)
    const article = await this.artSrv.findBySlug(slug);
    comments.article = article;
    comments.user = user;
    // comments.commentCount++
    delete user.password;
    Object.assign(comments, createCommentDto);

    return await this.commentRepo.save(comments);
  }
}
