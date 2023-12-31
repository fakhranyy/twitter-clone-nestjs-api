import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
//! import ormconfig from './ormconfig';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TagModule,
    ConfigModule.forRoot(),
    //! TypeOrmModule.forRoot(ormconfig),
    UserModule,
    ArticleModule,
    ProfileModule,
    AuthModule,
    CommentModule,
    DatabaseModule,
  ], // should import it to let me use config vars in database module
  controllers: [],
  providers: [],
})
export class AppModule {
  /*
   we want in all our application, always decode our token and get current user .. 
   this will be easier for us and then we don't need to write additional logic in some requests

   -> and here is how we can provide globally for all our actions this middleware 
  */
  configure(consumer: MiddlewareConsumer){     // this is a func where inside we have consumer, and what is between (##) is the consumer
    consumer.apply(AuthMiddleware).forRoutes({ //and specidy here for what roots we want to apply this middleware
      path: '*', // this star (*) means all, it means apply it for all routes
      method: RequestMethod.ALL, 
      // All of this, is a just Global middleware
    });
  }  
}
