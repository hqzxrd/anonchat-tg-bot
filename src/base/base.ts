import { DeleteResult } from "typeorm";

import Channel from "../models/channel.model";
import Chat from "../models/chat.model";
import Queue from "../models/queue.model";
import User from "../models/user.model";

import db from "./ormcfg";

async function init() {
  await db.initialize();
}

export async function getCountUser(): Promise<number> {
  return await db.getRepository(User).count();
}

export async function getUser(chat_id: string): Promise<User | null> {
  const user = await db.manager.findOne(User, {
    where: { chat_id },
  });

  return user ? user : null;
}

export async function createUser(chat_id: string): Promise<User | null> {
  const user = new User();

  const isUserExsists = await db.manager.findOne(User, {
    where: { chat_id },
  });

  if (isUserExsists) {
    return null;
  }

  user.chat_id = chat_id;

  return await db.manager.save(user);
}

////
export async function searchInQueue(): Promise<Queue | null> {
  const users = await db.manager.find(Queue);
  return users ? users[0] : users;
}

export async function enterQueue(chat_id: string): Promise<Queue> {
  const userQueue = new Queue();

  userQueue.chat_id = chat_id;

  return await db.manager.save(userQueue);
}

export async function leaveQueue(
  id: string,
  id2?: string
): Promise<DeleteResult | DeleteResult[]> {
  if (!id2) {
    return await db.manager.delete(Queue, { chat_id: id });
  } else {
    return await Promise.all([
      db.manager.delete(Queue, { chat_id: id }),
      db.manager.delete(Queue, { chat_id: id2 }),
    ]);
  }
}
////
export async function getCountChat() {
  return await db.getRepository(Chat).count();
}

export async function createChatRoom(
  chat_id1: string,
  chat_id2: string
): Promise<Chat> {
  const chat = new Chat();
  chat.chat_id1 = chat_id1;
  chat.chat_id2 = chat_id2;

  const createdChat = await db.manager.save(chat);

  return createdChat;
}

export async function checkActiveChat1(id: string, id2: string) {
  const user1 = await db.manager.findOne(Chat, {
    where: { chat_id1: id },
  });

  const user2 = await db.manager.findOne(Chat, {
    where: { chat_id2: id2 },
  });

  if (user1 && user2) {
    return { chat_id1: String(user1.id), chat_id2: String(user2.id) };
  } else {
    return null;
  }
}

export async function checkActiveChat2(id: string) {
  const room = await db.manager.findOne(Chat, { where: { chat_id2: id } });

  if (room) {
    return room;
  } else {
    return null;
  }
}

export async function leaveChat(id: number): Promise<DeleteResult> {
  return await db.manager.delete(Chat, { id });
}
////
export async function getChannels(): Promise<Channel[]> {
  return await db.manager.find(Channel);
}

export async function saveChannel(
  name: string,
  channel_id: string,
  link: string
): Promise<Channel | null> {
  const ch = new Channel();

  const isChannelExsists = await db.manager.findOne(Channel, {
    where: { channel_id },
  });

  if (isChannelExsists) {
    return null;
  }

  ch.channel_id = channel_id;
  ch.name = name;
  ch.link = link;

  return await db.manager.save(ch);
}

export async function deleteChannel(channel_id: string): Promise<DeleteResult> {
  return await db.manager.delete(Channel, { channel_id });
}
////
export async function clearChats(): Promise<void> {
  await db.manager.clear(Chat);
}

init();
