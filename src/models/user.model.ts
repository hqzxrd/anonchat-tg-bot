import { Entity, Column } from "typeorm";

import Base from "./base.model";

@Entity({ name: `User` })
class User extends Base {
  @Column()
  chat_id!: string;

  @Column()
  sex!: string;

  @Column({ default: false })
  isBanned!: boolean;

  @Column({ default: false })
  isAdmin!: boolean;
}

export default User;
