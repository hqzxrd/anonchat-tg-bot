import { Entity, Column } from "typeorm";

import Base from "./base.model";

@Entity({ name: `user` })
class User extends Base {
  @Column()
  chat_id!: string;

  @Column({ default: false })
  isBanned!: boolean;

  @Column({ default: false })
  isAdmin!: boolean;
}

export default User;
