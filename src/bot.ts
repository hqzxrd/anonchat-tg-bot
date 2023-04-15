import { Scenes, Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";

import { clearChats, getUser } from "./base/base";
import { configService } from "./config/config.service";
import { IBotSceneContext } from "./context/context.interface";
import adminScene from "./scenes/admin/admin.scene";
import chatScene from "./scenes/chat/chat.scene";
import mainScene from "./scenes/main/main.scene";
import queueScene from "./scenes/queue/queue.scene";

const bot = new Telegraf<IBotSceneContext>(configService(`TOKEN`));

const stage = new Scenes.Stage<IBotSceneContext>([
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
  await ctx.scene.enter(`main`);
});

bot.command(`adm`, async (ctx) => {
  const user = await getUser(String(ctx.chat.id));
  const adminId = configService(`ADMIN`);
  console.log(adminId, user);
  if (String(ctx.chat.id) === adminId || user?.isAdmin) {
    await ctx.scene.enter(`admin`);
  }
});

bot.command(`clear`, async (ctx) => {
  const user = await getUser(String(ctx.chat.id));
  const adminId = configService(`ADMIN`);

  if (String(ctx.chat.id) === adminId || user?.isAdmin) {
    await clearChats();
  }
});

bot.catch((err) => {
  console.log(err);
});

bot.launch();
