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
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Userdeco } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LazyModuleLoader } from '@nestjs/core';
import { ArticleModule } from './article.module';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { BackendValidationPipe } from 'src/common/pipes/backendValidation.pipe';
import { Article } from './entities/article.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('articles')
@ApiTags('Articles Apis')
export class ArticleController {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  //? what is @Query ?
  //* -> this is an object with all query params.
  //* -> every thing that is going after question mark is query parameters, So to get query param we use @Query() decorator.
  //* -> So we typing here @Query and then we're getting the object with all our parameters.
  //* -> And of course we can get a single parameter if we will provide it inside.
  @ApiAcceptedResponse({ description: 'Get all articles' })
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
  @ApiCreatedResponse({
    description: 'create an article ',
    type: Article,
  })
  @ApiBadRequestResponse({
    description: 'article cannot be created, try Again !',
  })
  //* this guard allow only for authenticated users to pass, which mean if we don't have token then we're getting 401 unAuthorized
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Userdeco() currentUser: User,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = await this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = moduleRef.get(ArticleService);
    const article = await lazySrv.createArticle(currentUser, createArticleDto);
    return lazySrv.buildArticaleResponse(article);
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
    @Userdeco('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    return await lazySrv.deleteArticle(slug, currentUserId);
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
  @UsePipes(new BackendValidationPipe()) //* that validationPipe would implement this pipe on params
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
    @Userdeco('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    const article = await lazySrv.addArticleToFavorites(slug, currentUserId);
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

  @ApiAcceptedResponse({
    description: 'Articles feed from the users whose i followed',
  })
  @ApiBadRequestResponse({ description: 'there are some errors' })
  @UseGuards(JwtAuthGuard)
  @Get('feed')
  async getFeed(
    @Userdeco('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ArticleModule);
    const lazySrv = (await moduleRef).get(ArticleService);
    return await lazySrv.getFeed(currentUserId, query);
  }
}
