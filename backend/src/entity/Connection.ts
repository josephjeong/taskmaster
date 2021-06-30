import {Entity, PrimaryColumn, ManyToOne, Column} from "typeorm";
import { User } from "./User";

@Entity('Connection')
export class Connection {

    @PrimaryColumn('text')
    requester: String;

    @PrimaryColumn('text')
    requestee: String;

    @Column()
    accepted: boolean;
}
