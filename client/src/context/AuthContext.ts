import { createContext } from "react";

export const AuthContext=createContext<{
    authData:{isAuthenticated:boolean,token:string},
    setAuthData: React.Dispatch<React.SetStateAction<{isAuthenticated:boolean,token:string}>>
}>({
    authData:{
        isAuthenticated:false,
        token:""
    },
    setAuthData:()=>{}
})