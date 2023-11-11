import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Userdeco } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly srv: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard) // this guard allow only for authenticated users to pass , which mean if we don't have token then we're getting 401 unAuthorized
  async create(@Userdeco() currentUser: User, @Body('article') createArticleDto: CreateArticleDto): Promise<any> {
    return await this.srv.createArticle(currentUser, createArticleDto);
    // return 'create Article';
  }

}
