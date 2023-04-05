import { Markup } from "telegraf";

export const chatMenu = Markup.keyboard([`Отключить собеседника`])
  .oneTime()
  .resize();
