import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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
}
