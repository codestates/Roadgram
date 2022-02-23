import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article.entity";

@Entity("Track")
export class Track {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, (article) => article.road, {onDelete: 'CASCADE' })
    @JoinColumn({ name: 'article_id' })
    article: Article;

    @Column({name: "article_id"})
    articleId: number;

    @Column({ nullable: true, name: "image_src" })
    imageSrc: string;

    @Column()
    location: string;

    @Column()
    order: number;

}