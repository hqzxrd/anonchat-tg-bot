import { Markup } from "telegraf";

export const adminMenu = Markup.keyboard([[`Посмотреть каналы`], [], [`Назад`]])
  .oneTime()
  .resize();
