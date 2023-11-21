import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Userdeco } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';
import { LazyModuleLoader } from '@nestjs/core';
import { ArticleModule } from './article.module';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Controller('/articles')
@ApiTags('Articles Apis')
export class ArticleController {
  //! constructor(private readonly srv: ArticleService) {}
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  //? what is @Query ?
  //* -> this is an object with all query params.
  //* -> every thing that is going after question mark is query parameters, So to get query param we use @Query() decorator.
  //* -> So we typing here @Query and then we're getting the object with all our parameters.
  //* -> And of course we can get a single parameter if we will provide it inside.
  @Get()
  async findAll(
    @Userdeco('id') currentUserid: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    return await lazySrv.findAll(currentUserid, query);
  }

  @Post()
  //* this guard allow only for authenticated users to pass, which mean if we don't have token then we're getting 401 unAuthorized
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @Userdeco() currentUser: User,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    const article = await lazySrv.createArticle(currentUser, createArticleDto);
    return lazySrv.buildArticaleResponse(article);
  }

  @Get(':slug') //* dynamic param
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    const article = await lazySrv.findBySlug(slug);
    return lazySrv.buildArticaleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @Userdeco('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    return await lazySrv.deleteArticle(slug, currentUserId);
  }

  @Patch(':slug')
  // @Put(':slug')
  @UseGuards(AuthGuard) //* thats mean it should be Authorized user
  @UsePipes(new ValidationPipe()) //* that validationPipe would implement this pipe on params
  async updateArticle(
    @Userdeco('id') currentUserId: number, //* this decorator has the metadata of user
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto, //! this means that I should write the body inside "article" : {} ,And if not it wouldn't work in update
  ) {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    const article = await lazySrv.updateArticle(
      slug,
      updateArticleDto,
      currentUserId,
    );
    return lazySrv.buildArticaleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard) //* it's only allowed to authorized users
  async addArticleToFavorites(
    @Userdeco('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);

    const article = await lazySrv.addArticleToFavorites(slug, currentUserId);
    return lazySrv.buildArticaleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard) //* it's only allowed to authorized users
  async deleteArticleFromFavorites(
    @Userdeco('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);

    const article = await lazySrv.deleteArticleFromFavorites(
      slug,
      currentUserId,
    );
    return lazySrv.buildArticaleResponse(article);
  }
}
