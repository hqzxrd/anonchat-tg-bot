import { Markup } from "telegraf";

import { button } from "../../../context/enum";

export const queueMenu = Markup.keyboard([[button.CANCEL_SEARCH]])
  .oneTime()
  .resize();
