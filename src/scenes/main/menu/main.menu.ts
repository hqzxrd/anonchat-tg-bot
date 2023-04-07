import { Markup } from "telegraf";
import { ReplyKeyboardMarkup } from "telegraf/typings/core/types/typegram";

import { getCountChat, getCountUser } from "../../../base/base";
import { button } from "../../../context/enum";

export async function mainMenu(): Promise<Markup.Markup<ReplyKeyboardMarkup>> {
  return Markup.keyboard([
    [button.SEARCH],
    [
      `👥 Всего пользователей: ${await getCountUser()}`,
      `🗣 Активных чатов: ${await getCountChat()}`,
    ],
  ])
    .oneTime()
    .resize();
}
