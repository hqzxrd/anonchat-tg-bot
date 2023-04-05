import { DataSource } from "typeorm";

import Channel from "../models/channel.model";
import Chat from "../models/chat.model";
import Queue from "../models/queue.model";
import User from "../models/user.model";

const db = new DataSource({
  type: `sqlite`,
  database: "database.db",
  synchronize: true,
  logging: true,
  entities: [User, Queue, Chat, Channel],
});

export default db;
