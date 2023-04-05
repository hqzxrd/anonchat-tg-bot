import { Markup } from "telegraf";
import { ReplyKeyboardMarkup } from "telegraf/typings/core/types/typegram";

import { getCountChat, getCountUser } from "../../../base/base";

export async function mainMenu(): Promise<Markup.Markup<ReplyKeyboardMarkup>> {
  return Markup.keyboard([
    [`Поиск случайного собеседника 🙍‍♀️🙎‍♂️`],
    [`Поиск Ж 🙍‍♀️`, `Поиск М 🙎‍♂️`],
    [`⚙️ Профиль`],
    [
      `👥 Всего пользователей: ${await getCountUser()}`,
      `🗣 Активных чатов: ${await getCountChat()}`,
    ],
  ])
    .oneTime()
    .resize();
}
