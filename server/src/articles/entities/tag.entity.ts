import { IsNotEmpty } from "class-validator";
import { TagHits } from "src/articles/entities/tagHits.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArticleToTag } from "./article_tag.entity";

@Entity('Tag')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({unique: true, name: "tagName"})
    tagName: string;

    @OneToMany(() => ArticleToTag, (articleToTag) => articleToTag.tagId, { cascade: true })
    @JoinColumn()
    tags: ArticleToTag[];

    @OneToMany(() => TagHits, (tagHits) => tagHits.tagId, { cascade: true })
    @JoinColumn()
    tagsHits: TagHits[];
}