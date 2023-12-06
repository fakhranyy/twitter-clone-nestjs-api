import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { Follow } from 'src/profile/entities/follow.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly artRepo: Repository<Article>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Follow) private readonly followRepo: Repository<Follow>,
    private dataSource: DataSource,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(Article)
      .createQueryBuilder(
        'articles', //* this is a alias
      )
      .leftJoinAndSelect(
        //* we loaded author relation, Becaue { eager: true } doesn't work in QueryBuilder
        'articles.author', //* this is the field which we want to join it, Without alias it should be -> Article.author ( Article = ArticleEntity className) -> which Article.author return a relation with UserEntity properties
        'author', //* alias
      );

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}`,
        //* we can provide only a single condition,
        //* ( articles.tagList ) => table.field
        //* ( % ) must be exist to find substring
      });
    }

    if (query.author) {
      //!  const author = await this.userRepo.findOne({ where: { username: query.author }});
      //TODO - better & shorter code and comment this - queryBuilder.andWhere("articles.authorId = :username", { username: author.username });
      queryBuilder.andWhere('author.username = :username', {
        username: query.author,
      }); //* we use author which is -> Article.author: UserEntity
    }

    if (query.favorited) {
      const author = await this.userRepo.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      const ids = author.favorites.map((el) => el.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids }); //* check if articles.id is exist inside the array (ids)
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC'); //* This function sorting the articles by createdAt field which in table articles ( DESC )

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      //* query is from @Query() decorator
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      //* offset means the number which we'll skip it from articles array and take the limit after it
      queryBuilder.offset(query.offset);
    }
    let favoriteIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepo.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorited = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });
    return { articles: articlesWithFavorited, articlesCount };
  }

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
    return this.artRepo.save(article); // then we publish it to database
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

  async findBySlug(slug: string): Promise<Article> {
    return await this.artRepo.findOne({ where: { slug } });
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    return await this.artRepo.delete({ slug });
  }

  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    currentUserId: number,
  ): Promise<Article> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    Object.assign(article, updateArticleDto); //! Object.assign(target, source)
    return await this.artRepo.save(article);
  }
  

  async addArticleToFavorites(slug: string, userId: number): Promise<Article> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favorites'],
    }); //* when we fetch a single user, we want to get this user with this relations

    const isArticleNotFavorited =
      user.favorites.findIndex(
        //* favorites relation property which return Article Entity
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1; //* in this case, if our findIndex return minus one, this means that the article is note favorite

    if (isArticleNotFavorited) {
      user.favorites.push(article); 
      article.favoritesCount++;
      await this.userRepo.save(user);
      await this.artRepo.save(article);
    }

    console.log('user', user);
    return article;
  }

  async deleteArticleFromFavorites(
    slug: string,
    userId: number,
  ): Promise<Article> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favorites'],
    }); //* when we fetch a single user, we want to get this user with this relations

    const articleIndex = user.favorites.findIndex(
      //* favorites relation property which return Article Entity
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepo.save(user);
      await this.artRepo.save(article);
    }
    return article;
  }


  async getFeed(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepo.find({
      where: { followerId: currentUserId },
    }); //* find return for us array of data

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }
    const followingUserIds = follows.map((follow) => follow.followingId); //* we return the id of the person who we followed
    const queryBuilder = this.dataSource
      //* this code checks that our authorId inside every single article is in our array of following userIds
      //* with this code inside our query builder, we will get only articles from prople that were following
      .getRepository(Article)
      .createQueryBuilder('articles') //* alias
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }
}
