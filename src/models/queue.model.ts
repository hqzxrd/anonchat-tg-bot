import { Column, Entity } from "typeorm";

import Base from "./base.model";

@Entity()
class Queue extends Base {
  @Column()
  chat_id!: string;
}

export default Queue;
