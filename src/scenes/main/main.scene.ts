import { Scenes } from "telegraf";

import {
  createChatRoom,
  createUser,
  enterQueue,
  getChannels,
  getUser,
  searchInQueue,
} from "../../base/base";
import { IBotSceneContext } from "../../context/context.interface";
import { button, warning } from "../../context/enum";

import { mainMenu } from "./menu/main.menu";

const mainScene = new Scenes.BaseScene<IBotSceneContext>(`main`);

mainScene.enter(async (ctx) => {
  try {
    ctx.session.room = null;
    ctx.session.room_id = 0;
    ctx.session.chat_id1 = ``;
    ctx.session.chat_id2 = ``;

    await createUser(String(ctx.chat?.id));

    await ctx.reply(`Меню`, await mainMenu());
  } catch (err) {
    console.log(err);
  }
});

mainScene.hears([button.SEARCH], async (ctx) => {
  const user = await getUser(String(ctx.chat.id));

  if (!user || user.isBanned) {
    await ctx.reply(warning.USER_NOT_FOUND);
    return;
  }
  try {
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

    channels.map((ch) => {
      str += `<a href="${ch.link}">${ch.name}</a> \n`;
    });

    if (!isSub.every((s) => s === true)) {
      await ctx.replyWithHTML(str);
      return;
    }

    const roommate = await searchInQueue();

    if (roommate) {
      const chat = await createChatRoom(String(ctx.chat.id), roommate.chat_id);
      console.log(chat);

      ctx.session.room_id = chat.id;
      ctx.session.chat_id1 = chat.chat_id1;
      ctx.session.chat_id2 = chat.chat_id2;

      ctx.scene.enter(`chat`);
    } else {
      await enterQueue(user.chat_id);

      ctx.scene.enter(`queue`);
    }
  } catch (err) {
    console.log(err);
  }
});

export default mainScene;
