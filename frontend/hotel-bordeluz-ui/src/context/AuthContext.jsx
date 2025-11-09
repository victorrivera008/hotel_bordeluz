import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const info = localStorage.getItem('user_info');
        if (isAuthenticated && info) {
            try {
                setUserInfo(JSON.parse(info));
            } catch (e) {
                console.error("Error parsing user info:", e);
                setIsAuthenticated(false);
            }
        } else {
            setUserInfo(null);
        }
    }, [isAuthenticated]);

    const login = (info) => {
        setIsAuthenticated(true);
        setUserInfo(info);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        setIsAuthenticated(false);
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};