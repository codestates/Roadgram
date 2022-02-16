import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article.entity";
import { Tag } from "./tag.entity";

@Entity('Article_tag')
export class ArticleToTag {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, (article) => article.tags, {onDelete: "CASCADE" })
    @JoinColumn({ name: "article_id" })
    article: Article;

    @Column({name: "article_id"})
    articleId: number;

    @ManyToOne(() => Tag, (tag) => tag.tags, {onDelete: "CASCADE" })
    @JoinColumn({ name: "tag_id" })
    tag: Tag;

    @Column({name: "tag_id"})
    tagId: number;

    @Column({name: "tag_name"})
    tagName: number;

    @Column()
    order: number;
}