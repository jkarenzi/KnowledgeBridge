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
    
    const [authData, dispatch ] = useReducer(authReducer, {
        token: localStorage.getItem('token'),
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
    })

    console.log(authData)

    return (
        <AuthContext.Provider value={{...authData, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}
