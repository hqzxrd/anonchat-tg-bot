import { Markup } from "telegraf";

import { button } from "../../../context/enum";

export const chatMenu = Markup.keyboard([button.CANCEL_CHAT])
  .oneTime()
  .resize();
