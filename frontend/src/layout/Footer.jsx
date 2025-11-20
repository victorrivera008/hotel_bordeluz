import React from 'react';
import { FaInstagram, FaFacebookF, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const style = {
    footer: {
        backgroundColor: '#1E1E1E', 
        color: '#EAEAEA',
        padding: '60px 20px 20px',
        fontFamily: 'Georgia, serif',
        marginTop: 'auto', 
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        borderBottom: '1px solid #333',
        paddingBottom: '40px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    title: {
        color: '#D4AF37', 
        fontSize: '1.2rem',
        marginBottom: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    text: {
        lineHeight: '1.6',
        fontSize: '0.95rem',
        color: '#CCC',
    },
    infoItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        marginBottom: '10px',
        color: '#CCC',
        fontSize: '0.95rem',
    },
    icon: {
        color: '#D4AF37',
        marginTop: '3px',
    },
    socialContainer: {
        display: 'flex',
        gap: '15px',
        marginTop: '10px',
    },
    socialLink: {
        backgroundColor: '#333',
        color: 'white',
        width: '35px',
        height: '35px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        textDecoration: 'none',
        transition: 'background 0.3s',
    },
    link: {
        color: '#CCC',
        textDecoration: 'none',
        transition: 'color 0.3s',
        marginBottom: '8px',
        display: 'inline-block',
    },
    copyright: {
        textAlign: 'center',
        paddingTop: '20px',
        fontSize: '0.85rem',
        color: '#888',
    }
};

const Footer = () => {
    return (
        <footer style={style.footer}>
            <div style={style.container}>
                
                <div style={style.column}>
                    <h3 style={{...style.title, fontSize: '1.5rem'}}>HBB | Bordeluz</h3>
                    <p style={style.text}>
                        Tu refugio exclusivo entre Villarrica y Pucón. Disfruta de la naturaleza con el máximo confort.
                    </p>
                    <div style={style.socialContainer}>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" style={style.socialLink}>
                            <FaInstagram />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" style={style.socialLink}>
                            <FaFacebookF />
                        </a>
                    </div>
                </div>

                <div style={style.column}>
                    <h4 style={style.title}>Explorar</h4>
                    <a href="#" style={style.link}>Inicio</a>
                    <a href="#" style={style.link}>Habitaciones</a>
                    <a href="#" style={style.link}>Servicios</a>
                    <a href="#" style={style.link}>Políticas de Privacidad</a>
                </div>

                <div style={style.column}>
                    <h4 style={style.title}>Contáctanos</h4>
                    
                    <div style={style.infoItem}>
                        <FaMapMarkerAlt style={style.icon} />
                        <span>
                            Camino a Pucón km. 12.5<br/>
                            Sector Molco
                        </span>
                    </div>
                    
                    <div style={style.infoItem}>
                        <FaPhone style={style.icon} />
                        <span>
                            (45) 245 0119 (Recepción)<br/>
                            +569 6394 9710
                        </span>
                    </div>

                    <div style={style.infoItem}>
                        <FaEnvelope style={style.icon} />
                        <span>contacto@hotelbordeluz.cl</span>
                    </div>
                </div>

            </div>

            <div style={style.copyright}>
                &copy; {new Date().getFullYear()} Hotel Boutique Bordeluz. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;