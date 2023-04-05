import { Scenes, session, Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";

import { clearAll, getUser } from "./base/base";
import { configService } from "./config/config.service";
import { IBotSceneContext } from "./context/context.interface";
import adminScene from "./scenes/admin/admin.scene";
import chatScene from "./scenes/chat/chat.scene";
import mainScene from "./scenes/main/main.scene";
import queueScene from "./scenes/queue/queue.scene";
import startScene from "./scenes/start/start.scene";

const bot = new Telegraf<IBotSceneContext>(configService(`TOKEN`));

const stage = new Scenes.Stage<IBotSceneContext>([
  startScene,
  mainScene,
  queueScene,
  chatScene,
  adminScene,
]);

const localSession = new LocalSession({
  database: `session.json`,
});

bot.use(localSession.middleware());

bot.use(stage.middleware());

bot.command(`start`, async (ctx) => {
  const user = await getUser(String(ctx.chat.id));

  !user ? ctx.scene.enter(`start`) : ctx.scene.enter(`main`);
});

bot.command(`adm`, (ctx) => {
  ctx.scene.enter(`admin`);
});

bot.command(`cl`, async (ctx) => {
  await clearAll();
});

bot.catch(async (err) => {
  console.log(`ОШИБКА!!!!!!!!!!!!!!!!! ` + err);
});

bot.launch();
