import {Entity, PrimaryColumn, Column} from "typeorm";

export enum Status {
    NOT_STARTED = "Not Started",
    IN_PROGRESS = "In Progress",
    BLOCKED = "Blocked",
    COMPLETED = "Completed"
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
    
    @Column("float")
    estimated_days: number;
}
