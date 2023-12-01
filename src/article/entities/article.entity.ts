import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class Article {

  @ApiProperty({description: 'Primary key as User Id', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({description: 'unique title of the article', example: 'unique-title-sghs'})
  @Column()
  slug: string;

  @ApiProperty({description: 'title of the article', example: 'title of article' })
  @Column()
  title: string;

  @ApiProperty({ description: 'description of the article', example: 'this is the description about the ... subject'})
  @Column({ nullable: true })
  description: string;

  @ApiProperty({description: 'whole body of the article', example: 'whole body of the article'})
  @Column({ nullable: true })
  body: string;

  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('simple-array') // this means that inside we will provide some values as an array
  tagList: string[];

  @Column({ default: 0 })
  favoritesCount: number;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  //? eager : true -> this option means that we will always load automatically this relation (author for our article)
  author: User; // first argument is the field name, it's not always should be the same name of entity class
}
