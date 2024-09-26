import { PeerUser } from "@/hooks/user/helpers/Base/PeerUser";
import { Cache } from "./Cache";
import { getUser } from "@/lib/utils/Gun/Users/getUser";
import { db } from "@/hooks/user/useMainUser";

export class PeerCache extends Cache<PeerUser> {
    async fetch(peerPub: string, force = false) {
        if(peerPub.startsWith("~")) peerPub = peerPub.replace("~", "")
        
        if(!force) {
            let peer = this.get(peerPub);

            if(!peer) {
                peer = await getUser(peerPub, db)

                this.set(peer.pub, peer)
            }

            return peer
        }

        return getUser(peerPub, db)
    }
}