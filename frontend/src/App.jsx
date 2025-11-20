import React, { useState, useEffect } from 'react';
import Header from './layout/Header'; 
import Footer from './layout/Footer';
import Home from './pages/Home'; 
import AuthModalContent from './features/Auth/AuthModalContent';
import DashboardEjecutivo from './features/Dashboard/DashboardEjecutivo'; 
import RoomsPage from './pages/RoomsPage'; 
import ServicesPage from './pages/ServicesPage'; 
import BookingPage from './features/Booking/BookingPage'; 
import ProfilePage from './features/Auth/ProfilePage'; 
import ContactoPage from './pages/ContactoPage';
import MyReservationsPage from './pages/MyReservationsPage'; 
import { AuthProvider, useAuth } from './context/AuthContext';


const modalStyle = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
    },
    content: {
        backgroundColor: 'white', padding: '30px', borderRadius: '8px',
        maxWidth: '400px', width: '90%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative', fontFamily: 'Georgia, serif',
    },
    closeButton: {
        position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none',
        fontSize: '1.5rem', cursor: 'pointer', color: '#4A2A1A',
    }
};

const BREAKPOINT = 900; 

const AppContent = () => {
    const [currentPage, setCurrentPage] = useState('Home');
    const [showLogin, setShowLogin] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < BREAKPOINT);
    
    const { isAuthenticated, userInfo, loading } = useAuth(); 
    
    const isStaff = isAuthenticated && userInfo && userInfo.rol !== 'Cliente';

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < BREAKPOINT);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    if (loading) {
        return (
            <div style={{
                backgroundColor: '#F4E8D8', 
                minHeight: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                fontSize: '1.5rem', 
                color: '#4A2A1A'
            }}>
                Cargando Hotel Bordeluz...
            </div>
        );
    }

    const renderContent = () => {
        if (isStaff) {
            switch (currentPage) {
                case 'Profile':
                    return <ProfilePage />;
                case 'Home': 
                default:
                    if(currentPage === 'Home') setCurrentPage('Dashboard'); 
                    return <DashboardEjecutivo />;
            }
        }
        
        switch (currentPage) {
            case 'Reservar':
                return <BookingPage triggerLogin={() => setShowLogin(true)} />;
            case 'Habitaciones':
                return <RoomsPage />; 
            case 'Servicios':
                return <ServicesPage />; 
            case 'Contacto':
                 return <ContactoPage />;
            case 'Profile':
                return isAuthenticated ? <ProfilePage /> : <Home triggerLogin={() => setShowLogin(true)} />;
            
            case 'MyReservations':
                return isAuthenticated ? <MyReservationsPage /> : <Home triggerLogin={() => setShowLogin(true)} />;

            case 'Home':
            default:
                return <Home triggerLogin={() => setShowLogin(true)} />;
        }
    };
    
    return (
        <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            minHeight: '100vh',
            boxSizing: 'border-box'
        }}>
            
            <Header 
                onLoginClick={() => setShowLogin(true)} 
                onNavigate={setCurrentPage} 
                isStaff={isStaff} 
                isMobile={isMobile}
            />
            
            <main style={{ boxSizing: 'border-box' }}>
                {renderContent()}
            </main>
            
            {!isStaff && <Footer />}

            {showLogin && !isAuthenticated && (
                <div style={modalStyle.overlay} onClick={() => setShowLogin(false)}>
                    <div style={modalStyle.content} onClick={e => e.stopPropagation()}>
                        <button 
                            style={modalStyle.closeButton} 
                            onClick={() => setShowLogin(false)}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>
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