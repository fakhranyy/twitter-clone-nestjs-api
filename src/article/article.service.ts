import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly repo: Repository<Article>,
  ) {}
  createArticle(
    currentUser: User,
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    const article = new Article(); // this will create for us an empty article
    Object.assign(article, createArticleDto); // Object.assign(target, source), we want to assign all properties from dto inside the target(article)
    // now we have a problem, our tagList can be undefined because it's not required so we did the next process ,, to check if it's undefined -> and if it was undefined give a null value to it
    if (!article.tagList) {
      article.tagList = []; // so this will create a list if we didn't pass one
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser; // we add the currentUser to the article object by the relation
    return this.repo.save(article); // then we publish it to database
  }

  buildArticaleResponse(article: Article): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

}
