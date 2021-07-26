import {Entity, PrimaryColumn, OneToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";


@Entity('CalendarCredential')
export class CalendarCredential {

    @PrimaryGeneratedColumn('increment')
    public id: number;

    @PrimaryColumn('text')
    token: String;

    @OneToOne (() => User)
    @JoinColumn({ name: "user" })
    user: string;
}
