export enum SearchBy {
  ALL = `Любой`,
  MALE = `Мужской`,
  FEMALE = `Женский`,
}

export enum button {
  SEARCH = `Поиск случайного собеседника 🙍‍♀️🙎‍♂️`,
  BACK = `Назад`,
  CANCEL_SEARCH = `Отменить поиск`,
  CANCEL_CHAT = `Отключиться`,
  ADMIN_ALL_CHANNELS = `Посмотреть каналы`,
}

export enum warning {
  FOUND = `Нашёл кое-кого для тебя!💕💞`,
  DISCONNECT = `Собеседник отключился`,
  REBOOT = `Бот был перезагружен`,
  QUEUE = `Ищем собеседника..`,
  CANCELED = `Поиск отменён`,
  USER_NOT_FOUND = `Пользователь не существует или забанен.\n/start`,

  ADMIN_SCENE_INFO = `<b>ADMIN</b>\nДобавить канал:\n<code>/add NAME::ID::LINK</code>\n<b>ИЛИ</b>\nПереслать сюда пост канала`,
  ADMIN_INVALID_ID = `Неверный ID`,
  ADMIN_NOT_FOUND_ID = `Канала с таким ID не существует`,
  ADMIN_INVALID_LINK = `Неверная ссылка`,
  ADMIN_NO_CHANNELS = `Нет каналов`,
  ADMIN_ADD_ERROR1 = `Бот не является администратором канала, добавление невозможно`,
  ADMIN_ADD_ERROR2 = `<b>Закрытый канал! Сгенерировать ссылку невозможно</b>\nКанал можно добавить через <code>/add NAME::ID::LINK</code>`,
  ADMIN_DELETE_SUCCES = `Канал удалён`,
}
