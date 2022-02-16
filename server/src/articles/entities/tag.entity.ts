import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArticleToTag } from "./article_tag.entity";

@Entity('Tag')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, name: "tag_name"})
    tag_name: string;

    @OneToMany(() => ArticleToTag, (articleToTag) => articleToTag.tag_id, { cascade: true })
    @JoinColumn()
    tags: ArticleToTag[];
}