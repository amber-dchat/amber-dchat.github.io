import { BaseUser } from "../Base/BaseUser";
import { SEA as EncryptionTools } from "@/lib/utils/Gun/SEA/SEA";
import { IGunInstance, ISEAPair } from "gun";
import { type GunUserInstance } from "../../useMainUser";

export class ClientUser extends BaseUser {
    _sea: ISEAPair
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(sea: ISEAPair, db: IGunInstance, user: GunUserInstance) {
        super(db, user)
        this._sea = sea
    }

    encrypt(data: string, epub: string) {
        return EncryptionTools.encryptData(data, this._sea.epriv, this._sea.epub, epub)
    }

    decrypt(data: string, epub: string) {
        return EncryptionTools.decryptMessage(data, this._sea.epriv, this._sea.epub, epub)
    }
}