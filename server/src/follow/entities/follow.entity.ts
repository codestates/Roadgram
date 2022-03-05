import { User } from "../../users/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Follow")
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.following, {onDelete:"CASCADE"})
    @JoinColumn({ name: "following_id" })
    following: User;
    
    @Column({ name: "following_id" })
    followingId: number;

    @ManyToOne(() => User, (user) => user.follower, {onDelete:"CASCADE"})
    @JoinColumn({ name:"follower_id" })
    follower: User;

    @Column({ name: "follower_id" })
    followerId: number;
}