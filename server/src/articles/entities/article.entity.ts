import { Comments } from "../../comments/entities/comments.entity";
import { Likes } from "../../likes/entities/likes.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ArticleToTag } from "./article_tag.entity";
import { Track } from "./track.entity";

@Entity('Article')
export class Article {
    map(arg0: (el: any) => any): number[] | PromiseLike<number[]> {
      throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (User) => User.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({name: "user_id"})
    userId: number;

    @Column({default: 0, name: "total_like"})
    totalLike: number;

    @Column({default: 0, name: "total_comment"})
    totalComment: number;

    @Column({default: ""})
    content: string;

    @Column()
    thumbnail: string;

    @CreateDateColumn({ type: "timestamp", name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", name: "updated_at"})
    updatedAt: Date;

    @OneToMany(() => Track, (track) => track.article, { cascade: true })
    @JoinColumn()
    road: Track[];

    @OneToMany(() => Comments, (comment) => comment.article, { cascade: true })
    @JoinColumn()
    comments?: Comments[];

    @OneToMany(() => Likes, (likes) => likes.article, { cascade: true })
    @JoinColumn()
    likes: Likes[];

    @OneToMany(() => ArticleToTag, (articleToTag) => articleToTag.article, { cascade: true })
    @JoinColumn()
    tags: ArticleToTag[];
}
