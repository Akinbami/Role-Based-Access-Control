import slugify from "slugify";
import { User } from "src/auth/entities/user.entity";
import { Category } from "src/category/entities/category.entity";
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    title: string;

    @Column('text')
    content: string;

    @Column()
    slug: string;

    @Column({default:  false})
    isPublished: boolean;

    @Column({ type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
    createdOn: Date;

    @Column({ type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
    modifiedOn: Date;

    @Column()
    mainImageUrl: string;

    @ManyToOne(type => User, user => user.posts,{
        eager: true
    })
    user: User;

    @ManyToOne(type => Category, category => category.posts, {
        eager: true
    })
    category: Category;

    @BeforeInsert()
    slugifyPost (): void{
        this.slug = slugify(this.title.substring(0,20), {
            lower: true,
            replacement: '-'
        })
    }

}
