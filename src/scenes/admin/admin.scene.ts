import { Scenes, Markup } from "telegraf";
import { message } from "telegraf/filters";

import { deleteChannel, getChannels, saveChannel } from "../../base/base";
import { IBotSceneContext } from "../../context/context.interface";
import { button, warning } from "../../context/enum";
import Channel from "../../models/channel.model";

import { adminMenu } from "./menu/menu.admin";

const isValidId = (id: string) => /^(-)?\d{5,32}$/.test(id);
const isValidLink = (link: string) => /^https?:\/\//.test(link);
const succesAddChannel = (name: string, id: string, link: string): string => {
  return `<b>Канал добавлен:\nНазвание: ${name}\nID: ${id}\nCсылка: ${link}</b>`;
};

const adminScene = new Scenes.BaseScene<IBotSceneContext>(`admin`);

adminScene.enter(async (ctx) => {
  ctx.replyWithHTML(warning.ADMIN_SCENE_INFO, adminMenu);
});

adminScene.command(`add`, async (ctx) => {
  const args = ctx.message.text.split(" ")[1].split(`::`);
  const name = args[0];
  const id = args[1];
  const link = args[2];

  if (!isValidId(id)) {
    ctx.reply(warning.ADMIN_INVALID_ID);
    return;
  }

  if (!isValidLink(link)) {
    ctx.reply(warning.ADMIN_INVALID_LINK);
    return;
  }

  await saveChannel(name, id, link);

  ctx.replyWithHTML(succesAddChannel(name, id, link));
});

adminScene.hears(button.ADMIN_ALL_CHANNELS, async (ctx) => {
  const channels = await getChannels();

  if (!channels[0]) {
    return ctx.reply(warning.ADMIN_NO_CHANNELS);
  }

  channels.forEach((ch: Channel) => {
    ctx.reply(
      succesAddChannel(ch.name, ch.channel_id, ch.link),
      Markup.inlineKeyboard([Markup.button.callback("Удалить", ch.channel_id)])
    );
  });
});

adminScene.hears(button.BACK, (ctx) => {
  ctx.scene.enter(`main`);
});

adminScene.on(message("forward_from_chat"), async (ctx) => {
  const channel = ctx.message.forward_from_chat;
  console.log(channel);
  if (channel.type !== `channel`) {
    return;
  }

  if (!channel.username) {
    ctx.replyWithHTML(warning.ADMIN_ADD_ERROR);
    return;
  }

  const name = channel.title;
  const id = String(channel.id);
  const link = `https://t.me/${channel.username}`;

  await saveChannel(name, id, link);

  ctx.replyWithHTML(
    succesAddChannel(name, id, link),
    Markup.inlineKeyboard([Markup.button.callback("Удалить", id)])
  );
});

adminScene.action(/^[-]?\d+$/, async (ctx) => {
  const id = ctx.match[0];

  await deleteChannel(id);
  ctx.editMessageText(warning.ADMIN_DELETE_SUCCES);
});

export default adminScene;
