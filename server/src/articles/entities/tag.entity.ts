import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArticleToTag } from "./article_tag.entity";

@Entity('Tag')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tag_name: string;

    @OneToMany(() => ArticleToTag, (ArticleToTag) => ArticleToTag.tag_id, { cascade: true })
    @JoinColumn()
    articleIds: ArticleToTag[];
}