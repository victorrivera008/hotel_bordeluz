// frontend/src/layout/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaRegCalendarCheck,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const style = {
  topBar: {
    backgroundColor: '#1E1E1E',
    color: '#D4AF37',
    padding: '5px 20px',
    fontSize: '0.85rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainNav: {
    backgroundColor: 'white',
    borderBottom: '1px solid #EAEAEA',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#4A2A1A',
    fontFamily: 'Georgia, serif',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  navLinksDesktop: {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  linkBase: {
    color: '#4A2A1A',
    textDecoration: 'none',
    padding: '10px 15px',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
  },
  buttonBase: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginLeft: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'opacity 0.3s',
  },
  loginButton: {
    backgroundColor: '#4A2A1A',
    color: 'white',
  },
  reserveButton: {
    backgroundColor: '#D4AF37',
    color: 'white',
  },
  logoutButton: {
    backgroundColor: '#A52A2A',
    color: 'white',
  },
  hoverColor: '#F4E8D8',
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: 'white',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 900,
    listStyle: 'none',
    padding: 0,
  },
  mobileLinkItem: {
    borderTop: '1px solid #F0F0F0',
    padding: '15px 20px',
    textAlign: 'left',
  },
  mobileIcon: {
    fontSize: '1.5rem',
    color: '#4A2A1A',
    cursor: 'pointer',
  },
  userMenuContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  userMenuTrigger: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#4A2A1A',
    backgroundColor: '#F4E8D8',
    padding: '8px 12px',
    borderRadius: '5px',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '120%',
    right: 0,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1100,
    width: '200px',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: '12px 15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#4A2A1A',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
};

const Header = ({ onLoginClick, onNavigate, isStaff, isRecepcion, isMobile }) => {
  const { isAuthenticated, logout, userInfo } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  
  // Debug: verificar props recibidos
  if (isStaff) {
    console.log('🔍 Header - isRecepcion recibido:', isRecepcion, '| userInfo.rol:', userInfo?.rol);
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      onNavigate('Home');
    }
  };

  const handleNavigation = (page) => {
    onNavigate(page);
    if (isMobile) setIsMenuOpen(false);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const renderNavLink = (name, page) => (
    <li key={page}>
      <a
        onClick={() => handleNavigation(page)}
        style={{
          ...style.linkBase,
          backgroundColor: hoveredLink === page ? style.hoverColor : 'transparent',
        }}
        onMouseEnter={() => setHoveredLink(page)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        {name}
      </a>
    </li>
  );

  // ==========================
  // HEADER STAFF (ADMIN)
  // ==========================
  if (isStaff) {
    return (
      <header style={{ position: 'relative' }}>
        <div style={style.topBar}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a
              href="https://www.instagram.com/hotelboutiquebordeluz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#D4AF37', marginRight: '10px' }}
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/hotelbordeluz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#D4AF37', marginRight: '20px' }}
            >
              <FaFacebookF />
            </a>
            <span>Panel de administración · Hotel Bordeluz</span>
          </div>
          <div>
            <FaEnvelope style={{ marginRight: '5px' }} />
            contacto@hotelbordeluz.cl
          </div>
        </div>

        <nav style={{ ...style.mainNav, justifyContent: 'space-between' }}>
          {/* Lado izquierdo: logo + navegación admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a onClick={() => handleNavigation('Dashboard')} style={style.logo}>
              HBB | Panel Staff
            </a>

            {/* Links de administración: Panel ejecutivo / Gestión reservas */}
            <ul style={style.navLinksDesktop}>
              {isRecepcion ? (
                <>
                  {renderNavLink('PANEL RECEPCIÓN', 'Dashboard')}
                  {renderNavLink('GESTIÓN DE RESERVAS', 'ReservasAdmin')}
                </>
              ) : (
                <>
                  {renderNavLink('PANEL EJECUTIVO', 'Dashboard')}
                  {renderNavLink('GESTIÓN DE RESERVAS', 'ReservasAdmin')}
                </>
              )}
            </ul>
          </div>

          {/* Menú usuario staff */}
          <div style={style.userMenuContainer} ref={dropdownRef}>
            <div
              style={style.userMenuTrigger}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUserCircle style={{ marginRight: '8px' }} />
              <span>
                {userInfo?.rol
                  ? userInfo.rol.replace('Recepcionista', 'Recepción')
                  : 'Staff'}
              </span>
            </div>

            {isDropdownOpen && (
              <div style={style.dropdownMenu}>
                <a
                  onClick={() => handleNavigation('Profile')}
                  style={style.dropdownItem}
                >
                  <FaUserCircle /> Ver Perfil
                </a>
                <a
                  onClick={handleLogout}
                  style={{ ...style.dropdownItem, color: '#A52A2A' }}
                >
                  <FaSignOutAlt /> Cerrar Sesión
                </a>
              </div>
            )}
          </div>
        </nav>
      </header>
    );
  }

  // ==========================
  // HEADER PÚBLICO / CLIENTES
  // ==========================
  return (
    <header style={{ position: 'relative' }}>
      <div style={style.topBar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a
            href="https://www.instagram.com/hotelboutiquebordeluz"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#D4AF37', marginRight: '10px' }}
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/hotelbordeluz"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#D4AF37', marginRight: '20px' }}
          >
            <FaFacebookF />
          </a>
          <span>Síguenos en Instagram y Facebook</span>
        </div>
        <div>
          <FaEnvelope style={{ marginRight: '5px' }} />
          contacto@hotelbordeluz.cl
        </div>
      </div>

      <nav style={style.mainNav}>
        <a onClick={() => handleNavigation('Home')} style={style.logo}>
          HBB | Hotel Boutique Bordeluz
        </a>

        {!isMobile && (
          <ul style={style.navLinksDesktop}>
            {renderNavLink('HOME', 'Home')}
            {renderNavLink('HABITACIONES', 'Habitaciones')}
            {renderNavLink('SERVICIOS', 'Servicios')}
            {renderNavLink('CONTACTO', 'Contacto')}
          </ul>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile &&
            (!isAuthenticated ? (
              <>
                <button
                  onClick={onLoginClick}
                  style={{ ...style.buttonBase, ...style.loginButton }}
                >
                  LOGIN / REGISTRO
                </button>
                <button
                  onClick={() => handleNavigation('Reservar')}
                  style={{ ...style.buttonBase, ...style.reserveButton }}
                >
                  RESERVAR ONLINE
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Dropdown Mi Cuenta */}
                <div style={style.userMenuContainer} ref={dropdownRef}>
                  <div
                    style={style.userMenuTrigger}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <FaUserCircle style={{ marginRight: '8px' }} />
                    <span>Mi Cuenta</span>
                  </div>

                  {isDropdownOpen && (
                    <div style={style.dropdownMenu}>
                      <a
                        onClick={() => handleNavigation('Profile')}
                        style={style.dropdownItem}
                      >
                        <FaUserCircle /> Ver Perfil
                      </a>
                      <a
                        onClick={() => handleNavigation('MisReservas')}
                        style={style.dropdownItem}
                      >
                        <FaRegCalendarCheck /> Mis Reservas
                      </a>
                      <a
                        onClick={handleLogout}
                        style={{ ...style.dropdownItem, color: '#A52A2A' }}
                      >
                        <FaSignOutAlt /> Cerrar Sesión
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleNavigation('Reservar')}
                  style={{ ...style.buttonBase, ...style.reserveButton }}
                >
                  RESERVAR
                </button>
              </div>
            ))}

          {isMobile && (
            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={style.mobileIcon}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          )}
        </div>
      </nav>

      {/* Menú móvil */}
      {isMobile && isMenuOpen && (
        <ul style={style.mobileMenu}>
          <li style={style.mobileLinkItem}>
            <a
              onClick={() => handleNavigation('Home')}
              style={style.linkBase}
            >
              HOME
            </a>
          </li>
          <li style={style.mobileLinkItem}>
            <a
              onClick={() => handleNavigation('Habitaciones')}
              style={style.linkBase}
            >
              HABITACIONES
            </a>
          </li>
          <li style={style.mobileLinkItem}>
            <a
              onClick={() => handleNavigation('Servicios')}
              style={style.linkBase}
            >
              SERVICIOS
            </a>
          </li>
          <li style={style.mobileLinkItem}>
            <a
              onClick={() => handleNavigation('Contacto')}
              style={style.linkBase}
            >
              CONTACTO
            </a>
          </li>

          {!isAuthenticated ? (
            <li style={style.mobileLinkItem}>
              <button
                onClick={onLoginClick}
                style={{
                  ...style.buttonBase,
                  ...style.loginButton,
                  width: '100%',
                  marginBottom: '10px',
                }}
              >
                LOGIN / REGISTRO
              </button>
              <button
                onClick={() => handleNavigation('Reservar')}
                style={{
                  ...style.buttonBase,
                  ...style.reserveButton,
                  width: '100%',
                }}
              >
                RESERVAR ONLINE
              </button>
            </li>
          ) : (
            <li style={style.mobileLinkItem}>
              <button
                onClick={() => handleNavigation('Profile')}
                style={{
                  ...style.buttonBase,
                  ...style.loginButton,
                  width: '100%',
                  marginBottom: '10px',
                }}
              >
                VER PERFIL
              </button>
              <button
                onClick={() => handleNavigation('MisReservas')}
                style={{
                  ...style.buttonBase,
                  ...style.reserveButton,
                  width: '100%',
                  marginBottom: '10px',
                }}
              >
                MIS RESERVAS
              </button>
              <button
                onClick={() => handleNavigation('Reservar')}
                style={{
                  ...style.buttonBase,
                  ...style.reserveButton,
                  width: '100%',
                  marginBottom: '10px',
                }}
              >
                RESERVAR ONLINE
              </button>
              <button
                onClick={handleLogout}
                style={{
                  ...style.buttonBase,
                  ...style.logoutButton,
                  width: '100%',
                }}
              >
                CERRAR SESIÓN
              </button>
            </li>
          )}
        </ul>
      )}
    </header>
  );
};

export default Header;
