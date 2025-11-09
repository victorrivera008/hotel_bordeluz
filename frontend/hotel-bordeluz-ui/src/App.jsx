import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import AuthModalContent from './components/AuthModalContent';
import DashboardEjecutivo from './components/DashboardEjecutivo'; 
import { AuthProvider, useAuth } from './context/AuthContext';

const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '20px', borderRadius: '8px', position: 'relative',
    maxWidth: '90%', 
};
const closeButtonStyle = {
    position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem'
};

const AppContent = () => {
    const { isAuthenticated, logout, userInfo } = useAuth();
    const [showLogin, setShowLogin] = useState(false); 

    const isStaff = isAuthenticated && userInfo?.rol !== 'Cliente';

    const rolDisplayName = userInfo ? userInfo.rol.replace('Recepcionista', 'Recepción').replace('Administrador', 'Admin') : 'Público';

    const renderContent = () => {
        if (isStaff) {
            return <DashboardEjecutivo />;
        }
        
        return <SearchForm triggerLogin={() => setShowLogin(true)} />;
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <header style={{ padding: '15px', backgroundColor: '#4A2A1A', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Hotel Bordeluz - Sistema de Reservas</h3>
                
                <div>
                    {!isAuthenticated ? (
                        <button 
                            onClick={() => setShowLogin(true)} 
                            style={{ padding: '8px 15px', backgroundColor: '#D4AF37', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>
                            Iniciar Sesión
                        </button>
                    ) : (
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <span style={{marginRight: '15px', fontSize: '0.9rem'}}>Bienvenido, {rolDisplayName}</span>
                            <button onClick={logout} style={{ padding: '8px 15px', backgroundColor: '#D4AF37', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </header>
            
            {renderContent()}

            {showLogin && !isAuthenticated && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <button onClick={() => setShowLogin(false)} style={closeButtonStyle}>X</button>
                        <AuthModalContent onSuccess={() => setShowLogin(false)} /> 
                    </div>
                </div>
            )}
        </div>
    );
};


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;