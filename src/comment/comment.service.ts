import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
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
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly artSrv: ArticleService,
    private readonly userSrv: UserService,
  ) {}
  async createComment(
    createCommentDto: CreateCommentDto,
    req: any,
    slug: string,
  ): Promise<Comment> {
    const comments = new Comment();
    const article = await this.artSrv.findBySlug(slug);
    const user = await this.userSrv.findOne(req.user.username);
    comments.user = user;
    delete user.password;
    comments.article = article;
    Object.assign(comments, createCommentDto);
    console.log(article.author);
    return await this.commentRepo.save(comments);
  }

  async deleteComment(commentId: number, req: User) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user', 'article'],
    });
    const commentAuthor = comment.user;
    const commentsArticle = comment.article.author;
    if (commentAuthor === req || commentsArticle === req) {
      return await this.commentRepo.remove(comment);
    }

    throw new HttpException(
      "you can't delete this comment, You're Not Authorized",
      HttpStatus.UNAUTHORIZED,
    );
  }

  async editComment(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    req: any,
  ) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    const user = comment.user.username;
    Object.assign(comment, updateCommentDto);

    if (req.user.username === user) {
      return await this.commentRepo.save(comment);
    }
    throw new HttpException(
      "you can't delete this comment, You're Not Authorized",
      HttpStatus.UNAUTHORIZED,
    );
  }
}
