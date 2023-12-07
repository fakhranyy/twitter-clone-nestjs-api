import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { ArticleService } from 'src/article/article.service';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    private readonly artSrv: ArticleService,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}
  async createComment(
    createCommentDto: CreateCommentDto,
    currentUserId: User,
    slug: string,
  ): Promise<Comment> {
    const comments = new Comment();
    const article = await this.artSrv.findBySlug(slug);
    comments.article = article;
    comments.user = currentUserId;
    console.log(currentUserId);
    Object.assign(comments, createCommentDto);

    return await this.commentRepo.save(comments);
  }
}
