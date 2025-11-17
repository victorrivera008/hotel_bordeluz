// frontend/hotel-bordeluz-ui/src/pages/ContactoPage.jsx (NUEVO ARCHIVO)

import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

// --- Estilos (Consistente con el resto del sitio) ---
const style = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px',
        backgroundColor: '#F4E8D8',
        minHeight: '80vh',
    },
    header: {
        textAlign: 'center',
        color: '#4A2A1A',
        marginBottom: '50px',
    },
    title: {
        fontSize: '3rem',
        borderBottom: '3px solid #D4AF37',
        display: 'inline-block',
        paddingBottom: '10px',
        fontFamily: 'Georgia, serif',
    },
    subtitle: {
        marginTop: '15px',
        color: '#4A2A1A',
        fontSize: '1.2rem',
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '40px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    infoColumn: {
        fontFamily: 'Georgia, serif',
        color: '#4A2A1A',
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        fontSize: '1.1rem',
        marginBottom: '25px', 
        lineHeight: '1.6',
    },
    mapFrame: {
        width: '100%',
        height: '400px',
        border: 'none',
        borderRadius: '8px',
    }
};

const ContactoPage = () => {
    return (
        <div style={style.container}>
            <div style={style.header}>
                {/* 1. Títulos solicitados */}
                <h1 style={style.title}>Formulario y Ubicación</h1>
                <p style={style.subtitle}>Información de contacto, formulario de contacto y mapa.</p>
            </div>

            <div style={style.contentGrid}>
                
                {/* 2. Columna de Información de Contacto (Datos de la web) */}
                <div style={style.infoColumn}>
                    <h2 style={{ color: '#D4AF37' }}>Contáctanos</h2>
                    <p style={{ marginBottom: '30px' }}>Estamos disponibles para ayudarte con tu reserva o evento.</p>
                    
                    <div style={style.infoItem}>
                        <FaMapMarkerAlt size="1.5em" color="#D4AF37" />
                        <div>
                            <strong>Dirección:</strong><br />
                            Camino a Pucón km. 12.5<br />
                            Sector Molco
                        </div>
                    </div>
                    
                    <div style={style.infoItem}>
                        <FaPhone size="1.5em" color="#D4AF37" />
                        <div>
                            <strong>Teléfonos:</strong><br />
                            (45) 245 0119 (Recepción)<br />
                            +569 6394 9710
                        </div>
                    </div>

                    <div style={style.infoItem}>
                        <FaEnvelope size="1.5em" color="#D4AF37" />
                        <div>
                            <strong>E-Mail:</strong><br />
                            contacto@hotelbordeluz.cl
                        </div>
                    </div>
                </div>

                {/* 3. Columna del Mapa (Enlace corregido) */}
                <div>
                    <h2 style={{ color: '#D4AF37' }}>Ubicación</h2>
                    <iframe 
                        /* ⚠️ ENLACE CORREGIDO Y FUNCIONAL */
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3087.3813275382536!2d-72.09407692418931!3d-39.30227897164045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96147c94b0d6687b%3A0xc02ec7b2fc3b087!2sHotel%20Borde%20Luz!5e0!3m2!1ses!2sus!4v1763341601351!5m2!1ses!2sus"
                        style={style.mapFrame}
                        allowFullScreen="" 
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ContactoPage;