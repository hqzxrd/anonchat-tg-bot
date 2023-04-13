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
  return `<b>Канал:\nНазвание: ${name}\nID: ${id}\nCсылка: ${link}</b>`;
};

const adminScene = new Scenes.BaseScene<IBotSceneContext>(`admin`);

adminScene.enter(async (ctx) => {
  try {
    await ctx.replyWithHTML(warning.ADMIN_SCENE_INFO, adminMenu);
  } catch (err) {
    console.log(err);
  }
});

adminScene.command(`add`, async (ctx) => {
  try {
    const args = ctx.message.text.split(" ")[1].split(`::`);
    const name = args[0];
    const id = args[1];
    const link = args[2];

    if (!isValidId(id)) {
      await ctx.reply(warning.ADMIN_INVALID_ID);
      return;
    }

    const isBotChatAdmin = await ctx.telegram.getChatMember(id, ctx.botInfo.id);
    console.log(isBotChatAdmin);

    if (isBotChatAdmin.status !== `administrator`) {
      ctx.reply(
        `Бот не является администратором канала, добавление невозможно`
      );
      return;
    }

    if (!isValidLink(link)) {
      await ctx.reply(warning.ADMIN_INVALID_LINK);
      return;
    }

    await saveChannel(name, id, link);

    await ctx.replyWithHTML(succesAddChannel(name, id, link));
  } catch (err) {
    if (err.response.error_code === 400) {
      await ctx.reply(`Канала с таким ID не существует`);
      console.log(err);
    }
    console.log(err);
  }
});

adminScene.hears(button.ADMIN_ALL_CHANNELS, async (ctx) => {
  try {
    const channels = await getChannels();

    if (!channels[0]) {
      return await ctx.reply(warning.ADMIN_NO_CHANNELS);
    }

    channels.map(async (ch: Channel) => {
      await ctx.replyWithHTML(
        succesAddChannel(ch.name, ch.channel_id, ch.link),
        Markup.inlineKeyboard([
          Markup.button.callback("Удалить", ch.channel_id),
        ])
      );
    });
  } catch (err) {
    console.log(err);
  }
});

adminScene.hears(button.BACK, (ctx) => {
  ctx.scene.enter(`main`);
});

adminScene.on(message("forward_from_chat"), async (ctx) => {
  try {
    const channel = ctx.message.forward_from_chat;
    console.log(channel);
    if (channel.type !== `channel`) {
      return;
    }

    const isBotChatAdmin = await ctx.telegram.getChatMember(
      channel.id,
      ctx.botInfo.id
    );

    if (isBotChatAdmin.status !== `administrator`) {
      ctx.reply(
        `Бот не является администратором канала, добавление невозможно`
      );
      return;
    }

    if (!channel.username) {
      await ctx.replyWithHTML(warning.ADMIN_ADD_ERROR);
      return;
    }

    const name = channel.title;
    const id = String(channel.id);
    const link = `https://t.me/${channel.username}`;

    await saveChannel(name, id, link);

    await ctx.replyWithHTML(
      succesAddChannel(name, id, link),
      Markup.inlineKeyboard([Markup.button.callback("Удалить", id)])
    );
  } catch (err) {
    console.log(err);
  }
});

adminScene.action(/^[-]?\d+$/, async (ctx) => {
  try {
    const id = ctx.match[0];

    await deleteChannel(id);
    ctx.editMessageText(warning.ADMIN_DELETE_SUCCES);
  } catch (err) {
    console.log(err);
  }
});

export default adminScene;
