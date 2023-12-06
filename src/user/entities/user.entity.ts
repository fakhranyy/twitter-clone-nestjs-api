import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Article } from 'src/article/entities/article.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: 'User id Like 1' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'ziad@gmail.com' })
  @Column()
  email: string;

  @ApiProperty({ example: 'short description about user' })
  @Column({ nullable: true })
  bio: string;

  @ApiProperty({ example: 'image url in the db' })
  @Column({ nullable: true })
  image: string; //* in our case, image is not really an image .. this is just the url where we can load the image

  @ApiProperty({ example: 'ziad99' })
  @Column()
  username: string;

  @ApiProperty({ example: 'its gonna hashed before insert' })
  @Column({ select: false }) //* it means that in our all requests, by default we're not selecting the password field
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.user )
  comments: Comment[];

  @ManyToMany(() => Article)
  @JoinTable()
  favorites: Article[]; //? the 3rd table name will be ( Plural Noun of entityClassOne _ relationName _ Plural Noun of entityClassTwo )
  //* in our case the 3rd table will be users_favorites_articles
}
