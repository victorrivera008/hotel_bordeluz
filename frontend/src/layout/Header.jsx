import React, { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaFacebookF, FaEnvelope, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaList } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const style = {
    topBar: {
        backgroundColor: '#1E1E1E',
        color: '#D4AF37',
        padding: '8px 40px',
        fontSize: '0.85rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: '500',
    },
    socialIcons: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    iconLink: {
        color: '#D4AF37',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        transition: 'opacity 0.3s',
    },
    contactInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },

    mainNav: {
        backgroundColor: 'white',
        borderBottom: '1px solid #EAEAEA',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        position: 'relative', 
    },
    logo: {
        color: '#4A2A1A', 
        fontFamily: 'Georgia, serif',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        cursor: 'pointer',
        letterSpacing: '1px',
    },
    navLinksDesktop: {
        display: 'flex',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        gap: '25px',
    },
    link: {
        color: '#555',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        padding: '5px 0',
        borderBottom: '2px solid transparent',
        transition: 'all 0.3s',
        cursor: 'pointer',
    },
    linkHover: {
        color: '#D4AF37',
        borderBottom: '2px solid #D4AF37',
    },

    actionsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    btnLogin: {
        backgroundColor: '#4A2A1A',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'background 0.3s',
    },
    btnReserve: {
        backgroundColor: '#D4AF37', 
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        cursor: 'pointer',
        textTransform: 'uppercase',
        boxShadow: '0 4px 6px rgba(212, 175, 55, 0.3)',
        transition: 'transform 0.2s, box-shadow 0.3s',
    },

    userMenuContainer: {
        position: 'relative',
    },
    userTrigger: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '4px',
        transition: 'background 0.2s',
        color: '#4A2A1A',
        fontWeight: '600',
    },
    dropdown: {
        position: 'absolute',
        top: '120%',
        right: 0,
        backgroundColor: 'white',
        border: '1px solid #EEE',
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        minWidth: '200px',
        zIndex: 1000,
        padding: '5px 0',
    },
    dropdownItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        color: '#555',
        textDecoration: 'none',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },

    mobileToggle: {
        fontSize: '1.5rem',
        color: '#4A2A1A',
        cursor: 'pointer',
        display: 'none', 
    },
    mobileMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
    }
};

const Header = ({ onLoginClick, onNavigate, isStaff, isMobile }) => {
    const { isAuthenticated, logout, userInfo } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleLogout = () => {
        if (window.confirm('¿Cerrar sesión?')) {
            logout();
            onNavigate('Home');
            setIsDropdownOpen(false);
        }
    };

    const handleNav = (page) => {
        onNavigate(page);
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    };

    const NavItem = ({ name, page }) => (
        <li style={{ listStyle: 'none' }}>
            <a
                onClick={() => handleNav(page)}
                style={style.link}
                onMouseEnter={(e) => { e.target.style.color = style.linkHover.color; e.target.style.borderBottom = style.linkHover.borderBottom; }}
                onMouseLeave={(e) => { e.target.style.color = style.link.color; e.target.style.borderBottom = style.link.borderBottom; }}
            >
                {name}
            </a>
        </li>
    );

    return (
        <header style={{ position: 'relative', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            <div style={style.topBar}>
                <div style={style.socialIcons}>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" style={style.iconLink}><FaInstagram /></a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" style={style.iconLink}><FaFacebookF /></a>
                    <span style={{ opacity: 0.8, marginLeft: '5px' }}>Síguenos en redes</span>
                </div>
                <div style={style.contactInfo}>
                    <FaEnvelope /> contacto@hotelbordeluz.cl
                </div>
            </div>

            <nav style={style.mainNav}>
                <a onClick={() => handleNav('Home')} style={style.logo}>
                    {isStaff ? 'HBB | Dashboard' : 'HBB | Bordeluz'}
                </a>

                {!isMobile && !isStaff && (
                    <ul style={style.navLinksDesktop}>
                        <NavItem name="HOME" page="Home" />
                        <NavItem name="HABITACIONES" page="Habitaciones" />
                        <NavItem name="SERVICIOS" page="Servicios" />
                        <NavItem name="CONTACTO" page="Contacto" />
                    </ul>
                )}

                <div style={style.actionsContainer}>
                    
                    {!isMobile && (
                        <>
                            {!isAuthenticated && (
                                <>
                                    <button onClick={onLoginClick} style={style.btnLogin}>Login</button>
                                    <button onClick={() => handleNav('Reservar')} style={style.btnReserve}>Reservar Online</button>
                                </>
                            )}
                            {isAuthenticated && (
                                <div style={style.userMenuContainer} ref={dropdownRef}>
                                    <div 
                                        style={{...style.userTrigger, backgroundColor: isDropdownOpen ? '#EEE' : 'transparent'}} 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <FaUserCircle size={20} />
                                        <span>{isStaff ? 'Administración' : 'Mi Cuenta'}</span>
                                    </div>

                                    {isDropdownOpen && (
                                        <div style={style.dropdown}>
                                            <div style={{padding: '10px 20px', borderBottom: '1px solid #eee', color: '#888', fontSize: '0.8rem'}}>
                                                Hola, {userInfo?.username || 'Usuario'}
                                            </div>
                                            
                                            <a onClick={() => handleNav('Profile')} style={style.dropdownItem}>
                                                <FaUserCircle color="#D4AF37"/> Ver Perfil
                                            </a>
                                            
                                            {!isStaff && (
                                                <a onClick={() => handleNav('MyReservations')} style={style.dropdownItem}>
                                                    <FaList color="#D4AF37"/> Mis Reservas
                                                </a>
                                            )}

                                            <a onClick={handleLogout} style={{...style.dropdownItem, color: '#C53030', borderTop: '1px solid #EEE'}}>
                                                <FaSignOutAlt /> Cerrar Sesión
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isAuthenticated && !isStaff && (
                                <button onClick={() => handleNav('Reservar')} style={style.btnReserve}>
                                    Reservar
                                </button>
                            )}
                        </>
                    )}

                    {isMobile && (
                        <div onClick={() => setIsMenuOpen(!isMenuOpen)} style={{...style.mobileToggle, display: 'block'}}>
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </div>
                    )}
                </div>
            </nav>

            {isMobile && isMenuOpen && (
                <div style={style.mobileMenu}>
                    <a onClick={() => handleNav('Home')} style={style.dropdownItem}>HOME</a>
                    <a onClick={() => handleNav('Habitaciones')} style={style.dropdownItem}>HABITACIONES</a>
                    <a onClick={() => handleNav('Servicios')} style={style.dropdownItem}>SERVICIOS</a>
                    <a onClick={() => handleNav('Contacto')} style={style.dropdownItem}>CONTACTO</a>
                    <hr style={{borderColor: '#EEE', margin: '10px 0'}}/>
                    
                    {!isAuthenticated ? (
                        <>
                            <button onClick={() => {onLoginClick(); setIsMenuOpen(false)}} style={{...style.btnLogin, width: '100%', marginBottom: '10px'}}>LOGIN</button>
                            <button onClick={() => handleNav('Reservar')} style={{...style.btnReserve, width: '100%'}}>RESERVAR</button>
                        </>
                    ) : (
                        <>
                            <a onClick={() => handleNav('Profile')} style={style.dropdownItem}><FaUserCircle/> Mi Perfil</a>
                            {!isStaff && <a onClick={() => handleNav('MyReservations')} style={style.dropdownItem}><FaList/> Mis Reservas</a>}
                            <a onClick={handleLogout} style={{...style.dropdownItem, color: 'red'}}><FaSignOutAlt/> Salir</a>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;