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

    @Column()
    total_like: number;

    @Column()
    total_comment: number;

    @Column()
    content: string;

    @Column()
    thumbnail: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @OneToMany(() => Track, (Track) => Track.article_id, { cascade: true })
    @JoinColumn()
    tracks: Track[];

    @OneToMany(() => Comment, (Comment) => Comment.article_id, { cascade: true })
    @JoinColumn()
    comments?: Comment[];

    @OneToMany(() => Like, (Like) => Like.article_id, { cascade: true })
    @JoinColumn()
    likes: Like[];

    @OneToMany(() => ArticleToTag, (ArticleToTag) => ArticleToTag.article_id, { cascade: true })
    @JoinColumn()
    tagIds: ArticleToTag[];
}