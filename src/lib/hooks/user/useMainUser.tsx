import GUN from "gun/gun";
import { IGunInstance, IGunUserInstance, IGunInstanceRoot, ISEAPair } from "gun";
import "gun/lib/radix"
import "gun/lib/radisk"
import "gun/lib/store"
import "gun/lib/rindexed"
import "gun/sea"
import { useState, useContext, createContext, useEffect } from "react";
import { ClientUser } from "./helpers/User/ClientUser";

export interface FetchUserData {
    alias: string;
    displayname: string;
    avatar: string;
    epub: string;
    pub: string;
    bio: string;
}

export interface UserContextValues {
    db: IGunInstance;
    userInfo?: ClientUser;
}

const UserContext = createContext<UserContextValues | null>(null)

export function useMainUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const db = GUN({
        peers: ['https://gun-manhattan.herokuapp.com/gun', `https://gundb-relay-mlccl.ondigitalocean.app/gun`] // TODO: Add our own servers instead of gun relays
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = db.user().recall({ sessionStorage: true }) as IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>

    const [userInfo, setUserInfo] = useState<ClientUser>()

    useEffect(() => {
        db.on("auth", (ack) => {
            // @ts-ignore Sea is active since we imported it earlier
            if(!ack?.sea) {
                // @ts-ignore
                setUserInfo(new ClientUser(ack.sea as ISEAPair, db, user))
            }
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const values: UserContextValues = {
        db,
        userInfo
    }

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    )
}