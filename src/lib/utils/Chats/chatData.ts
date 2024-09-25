// THIS IS A MOCK CHAT DATA FILE FOR UI DEVELOPMENT
import { PeerUser } from "@/hooks/user/helpers/Base/PeerUser"
import { db, UserContextValues } from "@/hooks/user/useMainUser"
import { getUser } from "../Gun/Users/getUser"

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
  public users: Cache<PeerUser> = {};

  constructor(user: UserContextValues) {
    this.user = user;
  }

  async getChats() {
    this.chats = [
      "ahqsoftwares",
      "shisui"
    ]
  }

  // This will likely explode once we add group DMs
  async refreshCache() {
    const refreshPromises = Object.keys(this.users)

    for (const alias of refreshPromises) {
      this.users[alias] = await getUser(alias, db)
    }

    return this
  }

  async getUser(uid: string): Promise<PeerUser> {
    if (this.users[uid]) {
      return this.users[uid]
    }

    const user = await getUser(uid, db)

    return user
  }
}