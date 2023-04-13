import { Scenes } from "telegraf";
import { message } from "telegraf/filters";

import { checkActiveChat1, leaveChat, leaveQueue } from "../../base/base";
import { IBotSceneContext } from "../../context/context.interface";
import { button, warning } from "../../context/enum";

import { chatMenu } from "./menu/chat.menu";

const chatScene = new Scenes.BaseScene<IBotSceneContext>(`chat`);

chatScene.enter(async (ctx) => {
  try {
    await ctx.reply(warning.FOUND, chatMenu);
    const id1 = ctx.session.chat_id1;
    const id2 = ctx.session.chat_id2;

    if (!id1 || !id2) {
      return;
    }

    await leaveQueue(id1, id2);

    let isOn = true;

    while (isOn === true) {
      const check = await checkActiveChat1(id1, id2);

      if (check === null) {
        isOn = false;

        await ctx.scene.enter(`main`);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } catch (err) {
    console.log(err);
  }
});

chatScene.hears(button.CANCEL_CHAT, async (ctx) => {
  try {
    const id1 = ctx.session.chat_id1;
    const id2 = ctx.session.chat_id2;
    const room_id = ctx.session.room_id;
    const activeChat = await checkActiveChat1(id1, id2);
    if (!activeChat || !id1 || !id2 || !room_id) {
      return ctx.scene.enter(`main`);
    }

    await ctx.telegram.sendMessage(id1, warning.DISCONNECT);
    await ctx.telegram.sendMessage(id2, warning.DISCONNECT);

    await leaveChat(room_id);
  } catch (err) {
    console.log(err);
  }
});

chatScene.on(message(`text`), async (ctx) => {
  sendMessage(`text`, ctx);
});

chatScene.on(message(`sticker`), async (ctx) => {
  sendMessage(`sticker`, ctx);
});

chatScene.on(message(`photo`), async (ctx) => {
  sendMessage(`photo`, ctx);
});

chatScene.on(message(`video`), async (ctx) => {
  sendMessage(`video`, ctx);
});

chatScene.on(message(`video_note`), async (ctx) => {
  sendMessage(`video_note`, ctx);
});

chatScene.on(message(`animation`), async (ctx) => {
  sendMessage(`animation`, ctx);
});

chatScene.on(message(`voice`), async (ctx) => {
  sendMessage(`voice`, ctx);
});

chatScene.on(message(`audio`), async (ctx) => {
  sendMessage(`audio`, ctx);
});

async function sendMessage(type: string, ctx: any) {
  try {
    const activeChat = await checkActiveChat1(
      ctx.session.chat_id1,
      ctx.session.chat_id2
    );
    if (
      !activeChat ||
      !ctx.chat.id ||
      !ctx.session.chat_id1 ||
      !ctx.session.chat_id2
    ) {
      await ctx.reply(warning.REBOOT);
      return ctx.scene.enter(`main`);
    }

    const message = ctx.message[type];
    const caption = ctx.message?.caption;

    switch (type) {
      case `text`:
        if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
          await ctx.telegram.sendMessage(ctx.session.chat_id2, message);
        } else {
          await ctx.telegram.sendMessage(ctx.session.chat_id1, message);
        }

        break;
      case `sticker`:
        if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
          await ctx.telegram.sendSticker(ctx.session.chat_id2, message.file_id);
        } else {
          await ctx.telegram.sendSticker(ctx.session.chat_id1, message.file_id);
        }
        break;
      case `photo`:
        if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
          await ctx.telegram.sendPhoto(
            ctx.session.chat_id2,
            message[ctx.message.photo.length - 1].file_id,
            {
              caption,
            }
          );
        } else {
          await ctx.telegram.sendPhoto(
            ctx.session.chat_id1,
            message[ctx.message.photo.length - 1].file_id,
            {
              caption,
            }
          );
        }
        break;
      case `video`:
        if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
          await ctx.telegram.sendVideo(ctx.session.chat_id2, message.file_id, {
            caption,
          });
        } else {
          await ctx.telegram.sendVideo(ctx.session.chat_id1, message.file_id, {
            caption,
          });
        }
        break;
      case `video_note`:
        if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
          await ctx.telegram.sendVideoNote(
            ctx.session.chat_id2,
            message.file_id
          );
        } else {
          await ctx.telegram.sendVideoNote(
            ctx.session.chat_id1,
            message.file_id
          );
        }
        break;
      case `animation`:
        if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
          await ctx.telegram.sendAnimation(
            ctx.session.chat_id2,
            message.file_id,
            {
              caption,
            }
          );
        } else {
          await ctx.telegram.sendVideo(ctx.session.chat_id1, message.file_id, {
            caption,
          });
        }
        break;
      case `voice`:
        if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
          await ctx.telegram.sendAudio(ctx.session.chat_id2, message.file_id, {
            caption: caption,
          });
        } else {
          await ctx.telegram.sendAudio(ctx.session.chat_id1, message.file_id, {
            caption: caption,
          });
        }
        break;
    }
  } catch (err) {
    if (err.response.description === `Forbidden: bot was blocked by the user`) {
      await ctx.reply(`Собеседник заблокировал бота..`);
      await ctx.scene.enter(`main`);
      console.log(err);
    }
  }
}

export default chatScene;
