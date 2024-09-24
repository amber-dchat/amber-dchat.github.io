// THIS IS A MOCK CHAT DATA FILE FOR UI DEVELOPMENT

import { profileDefault, ValidUserInfo } from "@/hooks/user/helpers/Base/BaseUser"
import { db, UserContextValues } from "@/hooks/user/useMainUser"

export interface Message {
  content: string
  createdAt: number
  soul: string
}

export type Cache<T> = {
  [key: string]: T | undefined
}

export class ChatData {
  user: UserContextValues
  public chats: string[] = [];

  public message: Cache<Message> = {};
  public users: Cache<ValidUserInfo> = {};

  constructor(user: UserContextValues) {
    this.user = user;
  }

  async getChats() {
    this.chats = [
      "ahqsoftwares",
      "shisui"
    ]
  }

  getUser(uid: string): Promise<ValidUserInfo> {
    return new Promise((r) => {
      if (this.users[uid]) {
        return this.users[uid]
      }

      db.get(`~@${uid}`).once((d) => {
        const pubkey = Object.keys(d._[">"])[0];

        this.user.db.get(pubkey).once((d) => {
          const resp = {
            ...d,
            avatar: profileDefault.replace("${username}", d.alias)
          };

          this.users[uid] = resp;
          r(resp);
        });
      });
    });
  }
}