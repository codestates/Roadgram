import { Comment } from "src/comments/entities/comment.entity";
import { Like } from "src/like/entities/like.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ArticleToTag } from "./article_tag.entity";
import { Track } from "./track.entity";

@Entity('Article')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (User) => User.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: number;

    @Column({default: 0})
    total_like: number;

    @Column({default: 0})
    total_comment: number;

    @Column({default: ""})
    content: string;

    @Column()
    thumbnail: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @OneToMany(() => Track, (track) => track.article, { cascade: true })
    @JoinColumn()
    road: Track[];

    @OneToMany(() => Comment, (comment) => comment.article, { cascade: true })
    @JoinColumn()
    comments?: Comment[];

    @OneToMany(() => Like, (like) => like.article, { cascade: true })
    @JoinColumn()
    likes: Like[];

    @OneToMany(() => ArticleToTag, (articleToTag) => articleToTag.article, { cascade: true })
    @JoinColumn()
    tags: ArticleToTag[];
}