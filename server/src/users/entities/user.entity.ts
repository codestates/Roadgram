import { Article } from 'src/articles/entities/article.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { Likes } from 'src/likes/entities/likes.entity';
import { Comments } from 'src/comments/entities/comments.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true, default: null })
  password: string;

  @Column({ default: '' })
  status_message: string;

  @Column({ default: '', name: 'profile_image' })
  profileImage: string;

  @Column({ default: 0, name: 'total_following' })
  totalFollowing: number;

  @Column({ default: 0, name: 'total_follower' })
  totalFollower: number;

  @Column()
  login_method: number;

  @Column({ default: null, nullable: true })
  refresh_token: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Article, (Article) => Article.user_id, { cascade: true })
  @JoinColumn()
  article?: Article[];

  @OneToMany(() => Follow, (Follow) => Follow.followerId, { cascade: true })
  @JoinColumn()
  follower?: Follow[];

  @OneToMany(() => Follow, (Follow) => Follow.followingId, { cascade: true })
  @JoinColumn()
  following?: Follow[];

  @OneToMany(() => Likes, (Likes) => Likes.userId, { cascade: true })
  @JoinColumn()
  likes: Likes[];

  @OneToMany(() => Comments, (Comment) => Comment.user, { cascade: true })
  @JoinColumn()
  comments?: Comment[];
}
