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
    article_id: number;

    @Column({ nullable: true, name: "image_src" })
    image_src: string;

    @Column()
    location: string;

    @Column()
    order: number;

}