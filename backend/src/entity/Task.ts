import {Entity, PrimaryColumn, Column} from "typeorm";

export enum Status {
    NOT_STARTED = "TO_DO",
    IN_PROGRESS = "IN_PROGRESS",
    BLOCKED = "BLOCKED",
    COMPLETED = "DONE"
}

@Entity('Task')
export class Task {

    @PrimaryColumn()
    id: string;

    @Column()
    project: string;

    @Column()
    creator: string;

    @Column()
    title: string;

    @Column()
    description: string;
    
    // timestamptz converts and stores as UTC timestamp in database
    @Column("timestamptz")
    deadline: Date;
    
    @Column({
        type: "enum",
        enum: Status,
        default: Status.NOT_STARTED
    })
    status: Status;
    
    @Column("real")
    estimated_days: number;
}
