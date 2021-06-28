import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity('User')
export class User {
    // uuid needs to be handled outside of primary column
    @PrimaryColumn()
    id: string;

    @Column()
    email: string;

    @Column()
    password_hash: string

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({nullable : true})
    avatar_url: string;

    @Column()
    bio: string;
}
