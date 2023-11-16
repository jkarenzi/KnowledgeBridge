import { useState } from "react";
import { createContext, useReducer } from "react";


export const AuthContext = createContext()

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {token: action.token, userInfo: action.userInfo};
        case 'LOGOUT':
            return {token: null, userInfo: null};
        default:
            return state   
    }
}
 
export const AuthProvider = ({children}) => {

    const AuthData = {
        token: null,
        userInfo: null
    }

    const [authData, dispatch ] = useReducer(authReducer, AuthData)

    console.log(authData)

    return (
        <AuthContext.Provider value={{...authData, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}
