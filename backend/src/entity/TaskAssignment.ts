import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("TaskAssignment")
export class TaskAssignment {
  @PrimaryColumn()
  id: string;

  @Column()
  task: string;
  
  @Column()
  user_assignee: string;

  @Column({ nullable: true })
  group_assignee: string;
}
