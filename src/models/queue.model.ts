import { Column, Entity } from "typeorm";

import Base from "./base.model";

@Entity()
class Queue extends Base {
  @Column()
  chat_id!: string;
  @Column()
  sex!: string;
  @Column()
  search_by!: string;
}

export default Queue;
