import { createContext, ReactNode, useState } from "react";

export default interface userInfoType {
    aud: string
    email: string
    exp: number
    given_name: string
    iat: number
    iss: string
    nameid: string
    nbf: number
}

export interface UserContextValue {
    userInfo: userInfoType;
    setUserInfo: React.Dispatch<React.SetStateAction<userInfoType>>;
    contextMsg: string | null;
    setContextMsg: React.Dispatch<React.SetStateAction<string | null>>;
    fadeOut: boolean;
    setFadeOut: React.Dispatch<React.SetStateAction<boolean>>;
    showMessage: (message: string) => void;
    READ_ACCESS_TOKEN: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    API_KEY: string;
}

export interface UserProviderProps {
    children: ReactNode;
}

export const UserContext = createContext<UserContextValue>({} as UserContextValue);

export function UserProvider({ children }: UserProviderProps) {
    const [userInfo, setUserInfo] = useState<userInfoType>({
        aud: "",
        email: "",
        exp: 0,
        given_name: "",
        iat: 0,
        iss: "",
        nameid: "",
        nbf: 0,
    });
    const [contextMsg, setContextMsg] = useState<string | null>(null);
    const [fadeOut, setFadeOut] = useState<boolean>(false);
    const READ_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTM2ZjhiNWEzZmQ2NjA0NmE0MzkzMWY5ZmViNTAwNSIsIm5iZiI6MTczMTU4OTkyNy44OTQ4NTI5LCJzdWIiOiI2NzM1ZjYxZmZmZTM4NzhlOWU5ZjhlYzMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.e3RHEnaj35bvIVjjWXB43uSehF4a7wD1fvO1EFHd85A';
    const CLIENT_ID = '779748b371464a0b85a3ea0bdcf47f39';
    const CLIENT_SECRET = '0233d3de035f42be8d891773b009a1b5';
    const API_KEY = 'AIzaSyCBgSTwhLqLHJjXx9dHtT4Qk5PnYOVCBos';

    function showMessage(message: string) {
        setContextMsg(message);
        setFadeOut(false); // Reset fading
        setTimeout(() => setFadeOut(true), 2000); // Start fading out after 2.7 seconds
        setTimeout(() => setContextMsg(null), 3000); // Remove after 3 seconds        
    };

    return (
        <UserContext.Provider value={
            {
                userInfo,
                setUserInfo,
                contextMsg,
                setContextMsg,
                fadeOut,
                setFadeOut,
                showMessage,
                READ_ACCESS_TOKEN,
                CLIENT_ID, CLIENT_SECRET,
                API_KEY
            }
            }>
            { children }
        </UserContext.Provider>
    )
}