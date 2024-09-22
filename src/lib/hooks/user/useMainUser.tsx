import GUN from "gun/gun";
import { IGunInstance, IGunUserInstance, IGunInstanceRoot } from "gun";
import "gun/lib/radix"
import "gun/lib/radisk"
import "gun/lib/store"
import "gun/lib/rindexed"
import "gun/sea"
import { useState, useContext, createContext, useEffect } from "react";

export interface FetchUserData {
    alias: string;
    displayname: string;
    avatar: string;
    epub: string;
    pub: string;
    bio: string;
}

export interface UserInfo {
    username: string,
    avatar: string,
    displayName: string,
    bio: string
}

export interface UserContextValues {
    db: IGunInstance;
    userInfo?: UserInfo;
}

const UserContext = createContext<UserContextValues | null>(null)

export function useMainUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const db = GUN({
        peers: ['https://gun-manhattan.herokuapp.com/gun', `https://gundb-relay-mlccl.ondigitalocean.app/gun`] // TODO: Add our own servers instead of gun relays
    })

    const user = db.user().recall({ sessionStorage: true }) as IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>

    const [userInfo, setUserInfo] = useState<UserInfo>()
    const [username, setUsername] = useState<string>()
    const [avatar, setAvatar] = useState<string>()
    const [bio, setBio] = useState<string>()
    const [displayName, setDisplayName] = useState<string>()

    useEffect(() => {
        db.on("auth", () => {
            console.log("DEBUG: USER LOGIN ", user)

            user.get("alias").on((d: string) => setUsername(d))
            user.get("avatar").on((a: string|undefined) => setAvatar(a ?? `https://api.dicebear.com/7.x/notionists/svg/seed=${username}`))
            user.get("bio").on((bio: string|undefined) => setBio(bio ?? ""))
            user.get("display_name").on((dn: string|undefined) => setDisplayName(dn || username))
        })
    }, [])

    useEffect(() => {
        if(!!username && !!displayName && !!bio && !!avatar) setUserInfo({
            username,
            bio,
            displayName,
            avatar
        })
    }, [userInfo, username, avatar, bio, displayName])

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