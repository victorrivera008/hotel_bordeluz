import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const style = {
    footer: {
        backgroundColor: '#4A2A1A', 
        color: 'white',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        width: '100%',
    },
    contentGrid: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        paddingBottom: '30px',
        marginBottom: '20px',
    },
    columnTitle: {
        color: '#D4AF37', 
        fontSize: '1.2rem',
        marginBottom: '15px',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        display: 'block',
        marginBottom: '8px',
        fontSize: '0.9rem',
        transition: 'color 0.3s',
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        fontSize: '0.9rem',
    }
};

const Footer = () => {
    return (
        <footer style={style.footer}>
            <div style={style.contentGrid}>
                <div>
                    <h4 style={style.columnTitle}>Contáctanos</h4>
                    <div style={style.contactItem}>
                        <FaMapMarkerAlt style={{ marginRight: '10px' }} />
                        Camino Villarrica a Pucón Km 12.5
                    </div>
                    <div style={style.contactItem}>
                        <FaPhone style={{ marginRight: '10px' }} />
                        (45) 245 0119
                    </div>
                    <div style={style.contactItem}>
                        <FaEnvelope style={{ marginRight: '10px' }} />
                        contacto@hotelbordeluz.cl
                    </div>
                </div>


                
                <div>
                    <h4 style={style.columnTitle}>Ayuda</h4>
                    <a href="/terminos" style={style.link}>Términos y Condiciones</a>
                    <a href="/privacidad" style={style.link}>Política de Privacidad</a>
                    <a href="/faq" style={style.link}>Preguntas Frecuentes</a>
                </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', paddingTop: '10px' }}>
                &copy; {new Date().getFullYear()} Hotel Bordeluz. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;