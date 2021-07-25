import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";

export enum Status {
  NOT_STARTED = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  BLOCKED = "BLOCKED",
  COMPLETED = "DONE"
}

@Entity("Task")
export class Task {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  project: string;

  @ManyToOne(() => User, user => user.id, { eager: true })
  @JoinColumn({ name: "creator" })
  creator: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  // timestamptz converts and stores as UTC timestamp in database
  @Column("timestamptz")
  deadline: Date;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.NOT_STARTED,
  })
  status: Status;

  @Column({ type: "real", nullable: true })
  estimated_days: number;
}
