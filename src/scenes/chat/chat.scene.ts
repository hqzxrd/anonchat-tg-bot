import { Scenes } from "telegraf";

import { checkActiveChat1, leaveChat, leaveQueue } from "../../base/base";
import { IBotSceneContext } from "../../context/context.interface";
import { button, warning } from "../../context/enum";

import { chatMenu } from "./menu/chat.menu";

const chatScene = new Scenes.BaseScene<IBotSceneContext>(`chat`);

chatScene.enter(async (ctx) => {
  ctx.reply(warning.FOUND, chatMenu);
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
});

chatScene.hears(button.CANCEL_CHAT, async (ctx) => {
  const id1 = ctx.session.chat_id1;
  const id2 = ctx.session.chat_id2;
  const room_id = ctx.session.room_id;
  if (!id1 || !id2 || !room_id) {
    return;
  }

  ctx.telegram.sendMessage(id1, warning.DISCONNECT);
  ctx.telegram.sendMessage(id2, warning.DISCONNECT);

  await leaveChat(room_id);
});

chatScene.on(`text`, async (ctx) => {
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
    ctx.reply(warning.REBOOT);
    return ctx.scene.enter(`main`);
  }

  if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
    ctx.telegram.sendMessage(ctx.session.chat_id2, ctx.message.text);
  } else {
    ctx.telegram.sendMessage(ctx.session.chat_id1, ctx.message.text);
  }
});

chatScene.on(`sticker`, async (ctx) => {
  if (!ctx.chat.id || !ctx.session.chat_id1 || !ctx.session.chat_id2) {
    return;
  }

  const sticker = ctx.message.sticker;

  if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
    ctx.telegram.sendSticker(ctx.session.chat_id2, sticker.file_id);
  } else {
    ctx.telegram.sendSticker(ctx.session.chat_id1, sticker.file_id);
  }
});

chatScene.on(`photo`, async (ctx) => {
  if (!ctx.chat.id || !ctx.session.chat_id1 || !ctx.session.chat_id2) {
    return;
  }

  const photo = ctx.message.photo[ctx.message.photo.length - 1];
  const caption = ctx.message.caption;

  if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
    ctx.telegram.sendPhoto(ctx.session.chat_id2, photo.file_id, {
      caption: caption,
    });
  } else {
    ctx.telegram.sendPhoto(ctx.session.chat_id1, photo.file_id, {
      caption: caption,
    });
  }
});

chatScene.on(`video`, async (ctx) => {
  if (!ctx.chat.id || !ctx.session.chat_id1 || !ctx.session.chat_id2) {
    return;
  }

  const video = ctx.message.video;
  const caption = ctx.message.caption;

  if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
    ctx.telegram.sendVideo(ctx.session.chat_id2, video.file_id, {
      caption: caption,
    });
  } else {
    ctx.telegram.sendVideo(ctx.session.chat_id1, video.file_id, {
      caption: caption,
    });
  }
});

chatScene.on(`video_note`, async (ctx) => {
  if (!ctx.chat.id || !ctx.session.chat_id1 || !ctx.session.chat_id2) {
    return;
  }

  const video_note = ctx.message.video_note;

  if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
    ctx.telegram.sendVideoNote(ctx.session.chat_id2, video_note.file_id);
  } else {
    ctx.telegram.sendVideoNote(ctx.session.chat_id1, video_note.file_id);
  }
});

chatScene.on(`animation`, async (ctx) => {
  if (!ctx.chat.id || !ctx.session.chat_id1 || !ctx.session.chat_id2) {
    return;
  }

  const animation = ctx.message.animation;
  const caption = ctx.message.caption;

  if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
    ctx.telegram.sendVideo(ctx.session.chat_id2, animation.file_id, {
      caption: caption,
    });
  } else {
    ctx.telegram.sendVideo(ctx.session.chat_id1, animation.file_id, {
      caption: caption,
    });
  }
});

chatScene.on(`voice`, async (ctx) => {
  if (!ctx.chat.id || !ctx.session.chat_id1 || !ctx.session.chat_id2) {
    return;
  }

  const voice = ctx.message.voice;
  const caption = ctx.message.caption;

  if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
    ctx.telegram.sendAudio(ctx.session.chat_id2, voice.file_id, {
      caption: caption,
    });
  } else {
    ctx.telegram.sendAudio(ctx.session.chat_id1, voice.file_id, {
      caption: caption,
    });
  }
});

chatScene.on(`audio`, async (ctx) => {
  if (!ctx.chat.id || !ctx.session.chat_id1 || !ctx.session.chat_id2) {
    return;
  }

  const audio = ctx.message.audio;
  const caption = ctx.message.caption;

  if (String(ctx.session.chat_id1) === String(ctx.chat.id)) {
    ctx.telegram.sendAudio(ctx.session.chat_id2, audio.file_id, {
      caption: caption,
    });
  } else {
    ctx.telegram.sendAudio(ctx.session.chat_id1, audio.file_id, {
      caption: caption,
    });
  }
});

export default chatScene;
