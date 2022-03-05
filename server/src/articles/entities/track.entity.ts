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

    @Column({ name: "image_src" })
    imageSrc: string;

    @Column({ name: "place_name" })
    placeName: string;

    @Column({ name: "address_name" })
    addressName: string;

    @Column('double')
    x: number;

    @Column('double')
    y: number;

    @Column()
    order: number;

}