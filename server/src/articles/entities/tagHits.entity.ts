import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from 'src/articles/entities/tag.entity';

@Entity('TagHits')
export class TagHits {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({name: "tag_id"})
  tagId: number;

  @ManyToOne(() => Tag, (Tag) => Tag.tagsHits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
  
  @Column({name: "tag_name"})
  tagName: String;

  @Column()
  hits: number;

  @Column({name: 'created_at'})
  createdAt: Date;

  @Column({name: 'ureated_at'})
  updatedAt: Date;
}
