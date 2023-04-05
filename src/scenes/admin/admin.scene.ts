import { Scenes, Markup } from "telegraf";
import { message } from "telegraf/filters";

import { deleteChannel, getChannels, saveChannel } from "../../base/base";
import { IBotSceneContext } from "../../context/context.interface";
import Channel from "../../models/channel.model";

import { adminMenu } from "./menu/menu.admin";

const isValidId = (id: string) => /^(-)?\d{5,32}$/.test(id);
const isValidLink = (link: string) => /^https?:\/\//.test(link);

const adminScene = new Scenes.BaseScene<IBotSceneContext>(`admin`);

adminScene.enter(async (ctx) => {
  ctx.replyWithHTML(
    `<b>ADMIN</b>\nДобавить канал:\n<code>/add NAME::ID::LINK</code>\n<b>ИЛИ</b>\nПереслать сюда пост канала`,
    adminMenu
  );
});

adminScene.command(`add`, async (ctx) => {
  const args = ctx.message.text.split(" ")[1].split(`::`);
  const name = args[0];
  const id = args[1];
  const link = args[2];

  if (!isValidId(id)) {
    ctx.reply("Неверный ID");
    return;
  }

  if (!isValidLink(link)) {
    ctx.reply("Неверная ссылка");
    return;
  }

  await saveChannel(name, id, link);

  ctx.replyWithHTML(
    `<b>Канал добавлен:\nНазвание: ${name}\nID: ${id}\nCсылка: ${link}</b>`
  );
});

adminScene.hears(`Посмотреть каналы`, async (ctx) => {
  const channels = await getChannels();

  if (!channels[0]) {
    return ctx.reply(`Нет каналов`);
  }

  channels.forEach((ch: Channel) => {
    ctx.reply(
      `Название: ${ch.name}\nid: ${ch.channel_id}\nСсылка: ${ch.link}`,
      Markup.inlineKeyboard([Markup.button.callback("Удалить", ch.channel_id)])
    );
  });
});

adminScene.hears(`Назад`, (ctx) => {
  ctx.scene.enter(`main`);
});

adminScene.on(message("forward_from_chat"), async (ctx) => {
  const channel = ctx.message.forward_from_chat;
  console.log(channel);
  if (channel.type !== `channel`) {
    return;
  }

  if (!channel.username) {
    ctx.replyWithHTML(
      `<b>Закрытый канал! Сгенерировать ссылку невозможно</b>\nКанал можно добавить через <code>/add NAME::ID::LINK</code>`
    );
    return;
  }

  const name = channel.title;
  const id = String(channel.id);
  const link = `https://t.me/${channel.username}`;

  await saveChannel(name, id, link);

  ctx.replyWithHTML(
    `<b>Канал добавлен:\nНазвание: ${name}\nID: ${id}\nCсылка: ${link}</b>`,
    Markup.inlineKeyboard([Markup.button.callback("Удалить", id)])
  );
});

//action for delete-callback channel
adminScene.action(/^[-]?\d+$/, async (ctx) => {
  const id = ctx.match[0];

  await deleteChannel(id);
  ctx.editMessageText(`Канал удалён`);
});

export default adminScene;
