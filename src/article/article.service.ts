import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(Article) private readonly repo: Repository<Article> ){}
  createArticle(currentUser: User ,createArticleDto: CreateArticleDto): Promise<Article> {
    const article = new Article();              // this will create for us an empty article
    Object.assign(article , createArticleDto);  // Object.assign(target, source), we want to assign all properties from dto inside the target(article)
    // now we have a problem, our tagList can be undefined because it's not required so we did the next process ,, to check if it's undefined -> give a null value to it
    if(!article.tagList){
      article.tagList = []; // so this will create a list if we didn't pass one
    }
    article.slug = 'ziad'; // just for testing ..
    article.author = currentUser;
    return this.repo.save(article);             // then we publish it to database
  }
}
