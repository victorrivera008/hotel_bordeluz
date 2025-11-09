import React, { useState } from 'react';
import { FaInstagram, FaFacebookF, FaEnvelope, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';


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
    }
};


const Header = ({ onLoginClick, onNavigate, isStaff, isMobile }) => { 
    const { isAuthenticated, logout, userInfo } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [hoveredLink, setHoveredLink] = useState(null);
    const [hoveredAction, setHoveredAction] = useState(null); 

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
            logout();
            onNavigate('Home'); 
        }
    };
    
    const handleNavigation = (page) => {
        onNavigate(page);
        if (isMobile) setIsMenuOpen(false);
    };

    const renderNavLink = (name, page) => (
        <li>
            <a 
                onClick={() => handleNavigation(page)} 
                style={{ 
                    ...style.linkBase,
                    backgroundColor: hoveredLink === page ? style.hoverColor : 'transparent' 
                }}
                onMouseEnter={() => setHoveredLink(page)}
                onMouseLeave={() => setHoveredLink(null)}
            >
                {name}
            </a>
        </li>
    );

    if (isStaff) {
        return (
            <header style={{ ...style.mainNav, justifyContent: 'space-between' }}>
                <a onClick={() => onNavigate('Home')} style={style.logo}>HBB | Dashboard</a>
                <div>
                    <span style={{ marginRight: '15px', color: '#4A2A1A' }}>{userInfo.rol.replace('Recepcionista', 'Recepción')}</span>
                    <button onClick={handleLogout} style={{...style.buttonBase, ...style.logoutButton}}>
                        <FaSignOutAlt style={{ marginRight: '5px' }} /> Cerrar Sesión
                    </button>
                </div>
            </header>
        );
    }

    return (
        <header style={{ position: 'relative' }}>
            <div style={style.topBar}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <a href="https://www.instagram.com/hotelboutiquebordeluz" target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37', marginRight: '10px' }}><FaInstagram /></a>
                    <a href="https://www.facebook.com/hotelbordeluz" target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37', marginRight: '20px' }}><FaFacebookF /></a>
                    <span>Síguenos en Instagram y Facebook</span>
                </div>
                <div>
                    <FaEnvelope style={{ marginRight: '5px' }} />
                    contacto@hotelbordeluz.cl
                </div>
            </div>

            <nav style={style.mainNav}>
                <a onClick={() => handleNavigation('Home')} style={style.logo}>HBB | Hotel Bautique Bordeluz</a>
                
                {!isMobile && (
                    <ul style={style.navLinksDesktop}>
                        {renderNavLink('HOME', 'Home')}
                        {renderNavLink('HABITACIONES', 'Habitaciones')}
                        {renderNavLink('SERVICIOS', 'Servicios')}
                        {renderNavLink('CONTACTO', 'Contacto')}
                    </ul>
                )}

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {!isMobile && (
                        !isAuthenticated ? (
                            <>
                                <button 
                                    onClick={onLoginClick} 
                                    style={{ ...style.buttonBase, ...style.loginButton }}
                                    onMouseEnter={() => setHoveredAction('login')}
                                    onMouseLeave={() => setHoveredAction(null)}
                                >
                                    LOGIN / REGISTRO
                                </button>
                                <button 
                                    onClick={() => handleNavigation('Reservar')} 
                                    style={{ ...style.buttonBase, ...style.reserveButton }}
                                    onMouseEnter={() => setHoveredAction('reserve')}
                                    onMouseLeave={() => setHoveredAction(null)}
                                >
                                    RESERVAR ONLINE
                                </button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaUserCircle style={{ color: '#4A2A1A', marginRight: '5px' }} />
                                <span style={{ marginRight: '15px', color: '#4A2A1A' }}>Mi Cuenta</span>
                                
                                <button 
                                    onClick={() => handleNavigation('Reservar')} 
                                    style={{ ...style.buttonBase, ...style.reserveButton }}
                                    onMouseEnter={() => setHoveredAction('reserve')}
                                    onMouseLeave={() => setHoveredAction(null)}
                                >
                                    RESERVAR
                                </button>

                                <button onClick={handleLogout} style={{ ...style.buttonBase, ...style.logoutButton }}>
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        )
                    )}
                    
                    {isMobile && (
                        <div onClick={() => setIsMenuOpen(!isMenuOpen)} style={style.mobileIcon}>
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </div>
                    )}
                </div>
            </nav>

            {isMobile && isMenuOpen && (
                <ul style={style.mobileMenu}>
                    <li style={style.mobileLinkItem}><a onClick={() => handleNavigation('Home')} style={style.linkBase}>HOME</a></li>
                    <li style={style.mobileLinkItem}><a onClick={() => handleNavigation('Habitaciones')} style={style.linkBase}>HABITACIONES</a></li>
                    <li style={style.mobileLinkItem}><a onClick={() => handleNavigation('Servicios')} style={style.linkBase}>SERVICIOS</a></li>
                    <li style={style.mobileLinkItem}><a onClick={() => handleNavigation('Contacto')} style={style.linkBase}>CONTACTO</a></li>
                    
                    {!isAuthenticated ? (
                        <li style={style.mobileLinkItem}>
                            <button onClick={onLoginClick} style={{ ...style.buttonBase, ...style.loginButton, width: '100%', marginBottom: '10px' }}>LOGIN / REGISTRO</button>
                            <button onClick={() => handleNavigation('Reservar')} style={{ ...style.buttonBase, ...style.reserveButton, width: '100%' }}>RESERVAR ONLINE</button>
                        </li>
                    ) : (
                        <li style={style.mobileLinkItem}>
                            <button onClick={() => handleNavigation('Reservar')} style={{ ...style.buttonBase, ...style.reserveButton, width: '100%', marginBottom: '10px' }}>RESERVAR ONLINE</button>
                            <button onClick={handleLogout} style={{ ...style.buttonBase, ...style.logoutButton, width: '100%' }}>CERRAR SESIÓN</button>
                        </li>
                    )}
                </ul>
            )}
        </header>
    );
};

export default Header;