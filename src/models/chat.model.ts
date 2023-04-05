import { Column, Entity } from "typeorm";

import Base from "./base.model";

@Entity()
class Chat extends Base {
  @Column()
  chat_id1!: string;
  @Column()
  chat_id2!: string;
}

export default Chat;
