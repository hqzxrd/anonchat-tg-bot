import { Column, Entity } from "typeorm";

import Base from "./base.model";

@Entity()
class Channel extends Base {
  @Column()
  channel_id!: string;
  @Column()
  name!: string;
  @Column()
  link!: string;
}

export default Channel;
