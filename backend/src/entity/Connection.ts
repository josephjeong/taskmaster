import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity('Connection')
export class Connection {

    @PrimaryColumn('text')
    requester: String;

    @PrimaryColumn('text')
    requestee: String;

    @Column()
    accepted: boolean;
}
