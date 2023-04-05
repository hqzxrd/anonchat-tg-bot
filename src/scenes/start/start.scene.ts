import { Scenes } from "telegraf";

import { createUser } from "../../base/base";
import { IBotSceneContext } from "../../context/context.interface";

import { startMenu } from "./menu/start.menu";

const startScene = new Scenes.BaseScene<IBotSceneContext>(`start`);

startScene.enter(async (ctx) => {
  ctx.reply(
    `<b>Привет! Для улучшения поиска укажи свой пол!</b> 🙎‍♀️🙎‍♂️`,
    startMenu
  );
});
startScene.hears(["Мужской", "Женский"], async (ctx) => {
  if (ctx.message.text) {
    const user = await createUser(String(ctx.chat.id), ctx.message.text);

    user
      ? ctx.reply(`Регистрация прошла успешно`)
      : ctx.reply(`Юзер уже существует`);

    ctx.scene.enter(`main`);
  }
});

export default startScene;
