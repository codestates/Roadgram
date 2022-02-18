import { Article } from 'src/articles/entities/article.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { Likes } from 'src/likes/entities/likes.entity';
import { Comment } from 'src/comment/entities/comment.entity';
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

  @Column({ default: '', name: "status_message" })
  statusMessage: string;

  @Column({ default: '', name: "profile_image" })
  profileImage: string;

  @Column({ default: 0, name: "total_following"})
  totalFollowing: number;

  @Column({ default: 0, name: "total_follwer" })
  totalFollower: number;

  @Column({name: "login_method"})
  loginMethod: number;

  @Column({ default: null, nullable: true, name: "refresh_token" })
  refreshToken: string;

  @CreateDateColumn({ type: 'timestamp', name: "created_at" })
  createdAt: Date;

  @OneToMany(() => Article, (Article) => Article.userId, { cascade: true })
  @JoinColumn()
  article?: Article[];

  @OneToMany(() => Follow, (Follow) => Follow.follower_id, { cascade: true })
  @JoinColumn()
  follower?: Follow[];

  @OneToMany(() => Follow, (Follow) => Follow.following_id, { cascade: true })
  @JoinColumn()
  following?: Follow[];

  @OneToMany(() => Likes, (Likes) => Likes.user_id, { cascade: true })
  @JoinColumn()
  likes: Likes[];

  @OneToMany(() => Comment, (Comment) => Comment.userId, { cascade: true })
  @JoinColumn()
  comments?: Comment[];
}
