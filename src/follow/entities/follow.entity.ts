import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Follow")
export class Follow  {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User,(User)=>User.id,{onDelete:"CASCADE"})
    @JoinColumn({name:"following_id"})
    following:User;
    
    @Column()
    following_id: number;

    @ManyToOne(()=>User,(User)=>User.id,{onDelete:"CASCADE"})
    @JoinColumn({name:"follower_id"})
    follower:User;

    @Column()
    follower_id: number;
}