import { Controller, Post, Body, UseGuards, Param,  Get, Delete, Put, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Userdeco } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('/articles')
@ApiTags('Articles Apis')
export class ArticleController {
  constructor(private readonly srv: ArticleService) {}
  @Post()
  @UseGuards(AuthGuard) //* this guard allow only for authenticated users to pass, which mean if we don't have token then we're getting 401 unAuthorized
  @UsePipes(new ValidationPipe())
  async create(
    @Userdeco() currentUser: User,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.srv.createArticle(currentUser, createArticleDto);
    return this.srv.buildArticaleResponse(article);
  }

  @Get(':slug') //* dynamic param
  async getSingleArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.srv.findBySlug(slug)
    return this.srv.buildArticaleResponse(article)
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@Userdeco('id') currentUserId: number, @Param('slug') slug: string){
    return await this.srv.deleteArticle(slug, currentUserId)
  }

  @Patch(':slug')
  // @Put(':slug')
  @UseGuards(AuthGuard)                     //* thats mean it should be Authorized user
  @UsePipes(new ValidationPipe())           //* that validationPipe would implement this pipe on params 
  async updateArticle(
    @Userdeco('id') currentUserId: number,  //* this decorator has the metadata of user 
     @Param('slug') slug: string,
     @Body('article') updateArticleDto: UpdateArticleDto, //! this means that I should write the body inside "article" : {} ,And if not it wouldn't work in update 
     ){
      const article = await this.srv.updateArticle(slug, updateArticleDto, currentUserId);
      return await this.srv.buildArticaleResponse(article);
  }
}
