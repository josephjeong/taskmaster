import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity('GoogleEvent')
export class GoogleEvent {

    @PrimaryColumn('text')
    event_id: String;

    @Column('text')
    user_id: String;

    @Column('text')
    task_assignment_id: String;

    @Column('text')
    task_id: String;
}
