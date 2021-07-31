import {Entity, PrimaryColumn, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";


@Entity('CalendarCredential')
export class CalendarCredential {

    @PrimaryColumn()
    user_id: String;

    @Column('text')
    access_token: String;

    @Column('text')
    refresh_token: String;
}
