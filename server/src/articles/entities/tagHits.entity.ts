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
  
  @Column({name: "tag_name", unique: true})
  tagName: string;

  @Column({default: () => 0})
  hits: number;

  @Column({type: "timestamp", name: 'created_at', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column({type: "timestamp", name: 'updated_at', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date;
}
