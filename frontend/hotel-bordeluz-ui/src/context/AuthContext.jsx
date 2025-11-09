import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
      
        const token = localStorage.getItem('access_token');
        const info = localStorage.getItem('user_info');
        
        if (token && info) {
            try {
                setAuthToken(token); 
                setUserInfo(JSON.parse(info)); 
                setIsAuthenticated(true); 
            } catch (e) {
                localStorage.clear();
                setAuthToken(null);
            }
        }
        setLoading(false); 
    }, []); 

   
    const login = (info, token) => { 
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_info', JSON.stringify(info));
        setAuthToken(token); 
        setUserInfo(info);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        setAuthToken(null); 
        setIsAuthenticated(false);
        setUserInfo(null);
    };

    const value = { isAuthenticated, userInfo, login, logout, loading }; 

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} 
        </AuthContext.Provider>
    );
};