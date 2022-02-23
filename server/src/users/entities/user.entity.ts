import { Article } from '../../articles/entities/article.entity';
import { Follow } from '../../follow/entities/follow.entity';
import { Likes } from '../../likes/entities/likes.entity';
import { Comments } from '../../comments/entities/comments.entity';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Users')
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

  @Column({ default: '', name: 'profile_image' })
  profileImage: string;

  @Column({ default: 0, name: 'total_following' })
  totalFollowing: number;

  @Column({ default: 0, name: 'total_follower' })
  totalFollower: number;

  @Column({ name: "login_method" })
  loginMethod: number;

  @Column({ default: null, nullable: true, name: "refresh_token" })
  refreshToken: string;

  @CreateDateColumn({ type: 'timestamp', name: "created_at" })
  createdAt: Date;

  @OneToMany(() => Article, (Article) => Article.userId, { cascade: true })
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

  @BeforeInsert()
  async hashPassword(password: string) {
    if(this.loginMethod===0){
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password || password, salt);
    }
  }
}
