import { Markup } from "telegraf";

export const startMenu = Markup.keyboard(["Мужской", "Женский"])
  .oneTime()
  .resize();
