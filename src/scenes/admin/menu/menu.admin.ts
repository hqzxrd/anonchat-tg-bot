import { Markup } from "telegraf";

import { button } from "../../../context/enum";

export const adminMenu = Markup.keyboard([
  [button.ADMIN_ALL_CHANNELS],
  [],
  [button.BACK],
])
  .oneTime()
  .resize();
