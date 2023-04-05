import { Markup } from "telegraf";

export const queueMenu = Markup.keyboard([[`Отменить поиск`]])
  .oneTime()
  .resize();
