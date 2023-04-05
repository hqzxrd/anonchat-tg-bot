import * as schedule from "node-schedule";
import { Scenes } from "telegraf";
import Context from "telegraf/typings/context";

import Chat from "../models/chat.model";

import { SearchBy } from "./enum";

interface ISceneSession extends Scenes.SceneSessionData {
  abuba: string;
}

interface ISceneSession extends Scenes.SceneSession<ISceneSession> {
  chat_id1: string;
  chat_id2: string;
  room_id: number;
  room: Chat | null;
  search_by: SearchBy;
  searchIsOn: true | false;
  // job?: schedule.Job;
}

export interface IBotSceneContext extends Context {
  session: ISceneSession;
  scene: Scenes.SceneContextScene<IBotSceneContext, ISceneSession>;
}
