import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { hash } from 'bcrypt';
import { Article } from 'src/article/entities/article.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  bio: string;

  @Column({nullable: true })
  image: string;             //* in our case, image is not really an image .. this is just the url where we can load the image

  @Column()
  username: string;

  @Column({ select: false }) //* it means that in our all requests, by default we're not selecting the password field  
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @ManyToMany(() => Article)
  @JoinTable()
  favorites: Article[]; //? the 3rd table name will be ( Plural Noun of entityClassOne _ relationName _ Plural Noun of entityClassTwo )
                        //* in our case the 3rd table will be users_favorites_articles
}
