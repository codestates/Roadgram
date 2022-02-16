import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Likes')
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (User) => User.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => Article, (article) => article.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @Column()
  article_id: number;
}
