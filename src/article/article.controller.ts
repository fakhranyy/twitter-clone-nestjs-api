import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Userdeco } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('/articles')
export class ArticleController {
  constructor(private readonly srv: ArticleService) {}
  @Post()
  @UseGuards(AuthGuard) // this guard allow only for authenticated users to pass , which mean if we don't have token then we're getting 401 unAuthorized
  async create(
    @Userdeco() currentUser: User,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.srv.createArticle(currentUser, createArticleDto);
    return this.srv.buildArticaleResponse(article);
  }
}
