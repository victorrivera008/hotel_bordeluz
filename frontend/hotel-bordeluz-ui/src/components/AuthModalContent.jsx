import React, { useState } from 'react';
import Login from './Login'; 
import Register from './Register'; 

const AuthModalContent = ({ onSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true); 

    const handleSwitch = () => {
        setIsLoginView(!isLoginView);
    };

    return (
        <>
            {isLoginView ? (
                <Login 
                    onSuccess={onSuccess} 
                    onSwitchToRegister={handleSwitch}
                />
            ) : (
                <Register 
                    onRegistrationSuccess={handleSwitch} 
                    onSwitchToLogin={handleSwitch} 
                />
            )}
        </>
    );
};

export default AuthModalContent;