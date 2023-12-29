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
  Query,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LazyModuleLoader } from '@nestjs/core';
import { ArticleModule } from './article.module';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { Article } from './entities/article.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('articles')
@ApiTags('Articles Apis')
export class ArticleController {
  constructor(private readonly lazyModuleLoader: LazyModuleLoader) {}

  //? what is @Query ?
  //* -> this is an object with all query params.
  //* -> every thing that is going after question mark is query parameters, So to get query param we use @Query() decorator.
  //* -> So we typing here @Query and then we're getting the object with all our parameters.
  //* -> And of course we can get a single parameter if we will provide it inside.
  @ApiAcceptedResponse({ description: 'Get all articles' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    // @Userdeco('id') currentUserid: number,
    @Request() req,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    return await lazySrv.findAll(req, query);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'create an article ',
    type: Article,
  })
  @ApiBadRequestResponse({
    description: 'article cannot be created, try Again !',
  })
  //* this guard allow only for authenticated users to pass, which mean if we don't have token then we're getting 401 unAuthorized
  @UseGuards(JwtAuthGuard)
  //! @UseGuards(LocalAuthGuard) //* check the username and password
  @UsePipes(new ValidationPipe())
  async createArticle(
    // @Userdeco() currentUser: User,
    @Request() req,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = await this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv =  moduleRef.get(ArticleService);
    const article = await lazySrv.createArticle(req, createArticleDto);
    return  lazySrv.buildArticaleResponse(article);
  }

  @ApiAcceptedResponse({ description: 'Get single article by slug' })
  @ApiBadRequestResponse({
    description: ' cannot get the article, there is no article by this slug',
  })
  @Get('single/:slug') //* param is a optional field
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    const article = await lazySrv.findBySlug(slug);
    return lazySrv.buildArticaleResponse(article);
  }
  @ApiAcceptedResponse({ description: 'Delete single article by slug' })
  @ApiBadRequestResponse({
    description:
      'Cannot delete this article , There is no article by this slug',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  async deleteArticle(
    @Request() req,
    @Param('slug') slug: string,
  ) {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    return await lazySrv.deleteArticle(slug, req);
  }

  @ApiCreatedResponse({
    description: 'find single article by slug and update it',
  })
  @ApiBadRequestResponse({
    description:
      'Cannot update this article , There is no article by this slug',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':slug')
  @UsePipes(new ValidationPipe())
  async updateArticle(  
    @Request() req,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto, //! this means that I should write the body inside "article" : {} ,And if not it wouldn't work in update
  ) {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    const article = await lazySrv.updateArticle(
      slug,
      updateArticleDto,
      req,
    );
    return lazySrv.buildArticaleResponse(article);
  }

  @ApiCreatedResponse({
    description: 'Add single article to favorites by slug',
  })
  @ApiBadRequestResponse({
    description:
      'Cannot add this article to favorites , There is no article by this slug',
  })
  @UseGuards(JwtAuthGuard)
  @Post(':slug')
  async addArticleToFavorites(
    @Request() req,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    const article = await lazySrv.addArticleToFavorites(slug, req);
    return lazySrv.buildArticaleResponse(article);
  }

  @ApiAcceptedResponse({
    description: 'Delete single article from favorites by slug',
  })
  @ApiBadRequestResponse({
    description:
      'Cannot delete this article , There is no article by this slug',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':slug/favorite')
  async deleteArticleFromFavorites(
    @Request() req,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);

    const article = await lazySrv.deleteArticleFromFavorites(
      slug,
      req,
    );
    return lazySrv.buildArticaleResponse(article);
  }

  @ApiAcceptedResponse({
    description: 'Articles feed from the users whose i followed',
  })
  @ApiBadRequestResponse({ description: 'there are some errors' })
  @UseGuards(JwtAuthGuard)
  @Get('feed')
  async getFeed(
    @Request() req,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    return await lazySrv.getFeed(req, query);
  }
}
