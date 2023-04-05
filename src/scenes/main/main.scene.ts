import { Scenes } from "telegraf";

import {
  createChatRoom,
  enterQueue,
  getChannels,
  getUser,
  searchInQueue,
} from "../../base/base";
import { IBotSceneContext } from "../../context/context.interface";
import { SearchBy } from "../../context/enum";
import Queue from "../../models/queue.model";

import { mainMenu } from "./menu/main.menu";

const mainScene = new Scenes.BaseScene<IBotSceneContext>(`main`);

mainScene.enter(async (ctx) => {
  ctx.reply(`Главное меню`, await mainMenu());

  ctx.session.room = null;
  ctx.session.room_id = 0;
  ctx.session.chat_id1 = ``;
  ctx.session.chat_id2 = ``;
});

mainScene.hears(
  [`Поиск случайного собеседника 🙍‍♀️🙎‍♂️`, `Поиск М 🙎‍♂️`, `Поиск Ж 🙍‍♀️`],
  async (ctx) => {
    const user = await getUser(String(ctx.chat.id));

    if (!user || user.isBanned) {
      ctx.reply(`Пользователь не существует или забанен.`);
      return;
    }

    const channels = await getChannels();

    const isSub = await Promise.all(
      channels.map(async (ch) => {
        const channelMember = await ctx.telegram.getChatMember(
          ch.channel_id,
          ctx.chat.id
        );
        return channelMember.status !== "left";
      })
    );

    let str = `Привет! Чат бесплатный, но нужно подписаться на несколько каналов:\n`;

    channels.forEach((ch) => {
      str += `<a href="${ch.link}">${ch.name}</a> \n`;
    });

    console.log(isSub);

    if (!isSub.every((s) => s === true)) {
      ctx.replyWithHTML(str);
      return;
    }

    ctx.session.search_by =
      ctx.message.text === `Поиск случайного собеседника 🙍‍♀️🙎‍♂️`
        ? SearchBy.All
        : ctx.message.text === `Поиск М 🙎‍♂️`
        ? SearchBy.Male
        : SearchBy.Female;

    let roommate: Queue | null;

    if (ctx.session.search_by === `Любой`) {
      const maybe = await searchInQueue(ctx.session.search_by);

      roommate = maybe
        ? maybe
        : await searchInQueue(user.sex, ctx.session.search_by);
    } else {
      const maybe = await searchInQueue(user.sex, ctx.session.search_by);

      roommate = maybe
        ? maybe
        : await searchInQueue(`Любой`, ctx.session.search_by);
    }

    if (roommate) {
      const chat = await createChatRoom(String(ctx.chat.id), roommate.chat_id);

      ctx.session.room_id = chat.id;
      ctx.session.chat_id1 = chat.chat_id1;
      ctx.session.chat_id2 = chat.chat_id2;

      ctx.scene.enter(`chat`);
    } else {
      await enterQueue(user.chat_id, user.sex, ctx.session.search_by);

      ctx.scene.enter(`queue`);
    }
  }
);

export default mainScene;
