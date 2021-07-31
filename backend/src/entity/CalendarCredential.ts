import {Entity, PrimaryColumn, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";


@Entity('CalendarCredential')
export class CalendarCredential {

    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column('text')
    access_token: String;

    @Column('text')
    refresh_token: String;

    @OneToOne (() => User, user => user.id)
    @JoinColumn({name: 'user'})
    user: User;
}
