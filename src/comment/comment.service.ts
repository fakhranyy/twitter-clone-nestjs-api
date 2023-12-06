import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { ArticleService } from 'src/article/article.service';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Article)
    private readonly artRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly artSrv: ArticleService,
  ) {}
  //* ترتيب البراميتر مهم زي ما كاتبه في الكنترول اكتبهم هنا بنفس الترتيب
  async createComment(
    currentUser: User,
    createCommentDto: CreateCommentDto,
    slug: string,
  ): Promise<Comment> {
    const article = await this.artSrv.findBySlug(slug);
    const comments = new Comment();
    comments.user = currentUser; //*  ->> many comments to one user <<-
    comments.article = article;     
    Object.assign(comments, createCommentDto) //* ->> Object.assign(target, source) <<-
    if ( comments ){
      comments.commentsCount++
    }
    return await this.commentRepo.save(comments);
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
