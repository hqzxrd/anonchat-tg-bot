import * as schedule from "node-schedule";
import { Scenes } from "telegraf";

import { checkActiveChat2, leaveQueue } from "../../base/base";
import { IBotSceneContext } from "../../context/context.interface";
import { button, warning } from "../../context/enum";

import { queueMenu } from "./menu/queue.menu";

const queueScene = new Scenes.BaseScene<IBotSceneContext>(`queue`);

queueScene.enter(async (ctx) => {
  await ctx.reply(warning.QUEUE, queueMenu);

  ctx.session.searchIsOn = true;
  while (!ctx.session.room && ctx.session.searchIsOn) {
    console.log(`Query for ${ctx.from?.first_name}`);
    ctx.session.room = await checkActiveChat2(String(ctx.chat?.id));
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (ctx.session.room) {
    const { id, chat_id1, chat_id2 } = ctx.session.room;
    ctx.session.room_id = id;
    ctx.session.chat_id1 = chat_id1;
    ctx.session.chat_id2 = chat_id2;
    ctx.session.searchIsOn = false;

    await ctx.scene.enter(`chat`);
  }
});

queueScene.hears(button.CANCEL_SEARCH, async (ctx) => {
  await leaveQueue(String(ctx.chat.id));

  ctx.session.searchIsOn = false;
  await ctx.reply(warning.CANCELED);
  ctx.scene.enter(`main`);
});

export default queueScene;
