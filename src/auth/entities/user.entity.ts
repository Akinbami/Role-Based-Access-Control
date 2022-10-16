import slugify from "slugify";
import { Post } from "src/post/entities/post.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Exclude } from "class-transformer";
import { AppRoles } from "src/app.role";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( )
    firstname: string;

    @Column()
    lastname: string;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true})
    profilepic: string;

    @Column({ type: 'enum', enum: AppRoles, default: AppRoles.READER})
    roles: AppRoles;

    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    @BeforeInsert()
    hashPassword (): void{
        this.password = bcrypt.hashSync(this.password, 16)
    }

}
