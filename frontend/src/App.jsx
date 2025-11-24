// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Home from './pages/Home';
import AuthModalContent from './features/Auth/AuthModalContent';
import DashboardEjecutivo from './features/Dashboard/DashboardEjecutivo';
import DashboardRecepcionista from './features/Dashboard/DashboardRecepcionista';
import RoomsPage from './pages/RoomsPage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './features/Booking/BookingPage';
import MyBookingsPage from './features/Booking/MyBookingsPage';
import ProfilePage from './features/Auth/ProfilePage';
import ContactoPage from './pages/ContactoPage';
import AdminReservationsPage from './features/Admin/AdminReservationsPage'; // 👈 IMPORTANTE
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
  const [showDebug, setShowDebug] = useState(true); 
  const [currentPage, setCurrentPage] = useState('Home');
  const [showLogin, setShowLogin] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < BREAKPOINT);
  const [scrollToHabitacion, setScrollToHabitacion] = useState(null);

  const { isAuthenticated, userInfo, loading } = useAuth();

  // Roles que consideramos "staff" en el front
  const role = userInfo?.rol?.toString()?.toLowerCase()?.trim() || '';

  // Debug: verificar el rol (puedes eliminar esto después)
  if (userInfo?.rol) {
    console.log('🔍 Rol detectado:', userInfo.rol, '→ normalizado:', role);
  }

  const isStaff =
    isAuthenticated &&
    (
      userInfo?.is_staff === true ||          // si viene de Django
      role === 'administrador' ||
      role === 'admin' ||
      role === 'recepcionista' ||
      role === 'recepcion' ||
      role.includes('recepcion') ||
      role === 'gerencia'
    );

  // Helpers para detectar roles específicos
  const isAdminLike = ['admin', 'administrador', 'gerencia'].includes(role);
  // Aceptar tanto "recepcionista" como "recepcion" (el backend puede devolver cualquiera)
  const isRecepcion = role === 'recepcionista' || role === 'recepcion' || role.includes('recepcion');
  
  // Debug: verificar detección de recepcionista
  if (isAuthenticated) {
    console.log('🔍 isRecepcion:', isRecepcion, '| isAdminLike:', isAdminLike, '| isStaff:', isStaff);
  }


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

  const handleVerHabitaciones = (numero) => {
    setScrollToHabitacion(numero || null);
    setCurrentPage('Habitaciones');
  };

  const renderContent = () => {
    // =========================
    // MODO STAFF / ADMIN
    // =========================
    if (isStaff) {
      switch (currentPage) {
        case 'Dashboard':
          // Si es recepcionista, mostrar su dashboard; si es admin, el ejecutivo
          if (isRecepcion) {
            return <DashboardRecepcionista onNavigate={setCurrentPage} />;
          }
          return <DashboardEjecutivo />;

        case 'ReservasAdmin':
          return <AdminReservationsPage />;  // 👈 aquí

        case 'Profile':
          return <ProfilePage />;

        case 'Home':
        default:
          // Si es recepcionista, mostrar su dashboard por defecto; si es admin, el ejecutivo
          console.log('🔍 renderContent - Home/Default | isRecepcion:', isRecepcion, '| currentPage:', currentPage);
          if (isRecepcion) {
            console.log('✅ Mostrando DashboardRecepcionista');
            return <DashboardRecepcionista onNavigate={setCurrentPage} />;
          }
          console.log('✅ Mostrando DashboardEjecutivo');
          return <DashboardEjecutivo />;
      }
    }

    // =========================
    // MODO CLIENTE / PÚBLICO
    // =========================
    switch (currentPage) {
      case 'Reservar':
        return <BookingPage triggerLogin={() => setShowLogin(true)} />;

      case 'MisReservas':
        return <MyBookingsPage triggerLogin={() => setShowLogin(true)} />;

      case 'Habitaciones':
        return (
          <RoomsPage
            onReservar={() => setCurrentPage('Reservar')}
            scrollToHabitacion={scrollToHabitacion}
          />
        );

      case 'Servicios':
        return <ServicesPage />;

      case 'Contacto':
        return <ContactoPage />;

      case 'Profile':
        return isAuthenticated
          ? <ProfilePage />
          : (
            <Home
              triggerLogin={() => setShowLogin(true)}
              onVerHabitaciones={handleVerHabitaciones}
            />
          );

      case 'Home':
      default:
        return (
          <Home
            triggerLogin={() => setShowLogin(true)}
            onVerHabitaciones={handleVerHabitaciones}
          />
        );
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
        isRecepcion={isRecepcion}
        isMobile={isMobile}
      />

      <main style={{ boxSizing: 'border-box' }}>
        {/* Debug temporal: mostrar info del usuario */}
        {isAuthenticated && isStaff && showDebug && (
          <div style={{
            position: 'fixed',
            top: '15px',
            right: '15px',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            fontSize: '0.9rem',
            zIndex: 9999,
            minWidth: '220px',
            border: '1px solid #e5d3a4',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.25s ease-out'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '6px'
            }}>
              <strong style={{ color: '#4A2A1A' }}>Debug Info</strong>

              <button
                onClick={() => setShowDebug(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  marginLeft: '10px',
                  color: '#4A2A1A',
                  fontWeight: 'bold'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ color: '#333' }}>
              <div><strong>Rol:</strong> {role}</div>
            </div>
          </div>
        )}
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
