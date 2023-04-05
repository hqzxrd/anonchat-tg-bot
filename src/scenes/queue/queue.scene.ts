import * as schedule from "node-schedule";
import { Scenes } from "telegraf";

import { checkActiveChat2, leaveQueue } from "../../base/base";
import { IBotSceneContext } from "../../context/context.interface";

import { queueMenu } from "./menu/queue.menu";

const queueScene = new Scenes.BaseScene<IBotSceneContext>(`queue`);

queueScene.enter(async (ctx) => {
  const sex = ctx.session.search_by;
  ctx.reply(
    `Ищем ${
      sex === `Любой`
        ? `случайного собеседника`
        : sex === `Мужской`
        ? `парня`
        : `девушку`
    }..`,
    queueMenu
  );

  ctx.session.searchIsOn = true;
  while (!ctx.session.room && ctx.session.searchIsOn) {
    console.log(`Query ${sex} for ${ctx.from?.first_name}`);
    ctx.session.room = await checkActiveChat2(String(ctx.chat?.id));
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (ctx.session.room) {
    const { id, chat_id1, chat_id2 } = ctx.session.room;
    ctx.session.room_id = id;
    ctx.session.chat_id1 = chat_id1;
    ctx.session.chat_id2 = chat_id2;
    ctx.session.searchIsOn = false;

    ctx.scene.enter(`chat`);
  }
});

queueScene.hears(`Отменить поиск`, async (ctx) => {
  await leaveQueue(String(ctx.chat.id));

  ctx.session.searchIsOn = false;
  ctx.reply(`Поиск отменён`);
  ctx.scene.enter(`main`);
});

export default queueScene;
