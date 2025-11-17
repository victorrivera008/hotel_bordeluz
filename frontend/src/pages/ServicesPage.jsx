// frontend/hotel-bordeluz-ui/src/pages/ServicesPage.jsx (CÓDIGO COMPLETO Y FINAL)

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaSpa, FaUtensils, FaCocktail, FaRegCalendarCheck } from 'react-icons/fa'; // Importamos íconos para los servicios

// --- Estilos (Reutilizamos el estilo de RoomsPage) ---
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
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginTop: '40px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Asegura que el footer se alinee abajo
    },
    cardImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        backgroundColor: '#E0E0E0',
    },
    cardContent: {
        padding: '20px',
        flexGrow: 1,
    },
    cardTitle: {
        color: '#4A2A1A',
        fontSize: '1.8rem',
        marginBottom: '10px',
        fontFamily: 'Georgia, serif',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    cardDescription: {
        fontSize: '0.95rem',
        color: '#666',
        marginBottom: '15px',
    },
    cardFooter: {
        marginTop: '20px',
        textAlign: 'center',
        backgroundColor: '#D4AF37',
        color: 'white',
        padding: '12px 20px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
    },
};
// ---

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            setError(null);
            try {
                // ⚠️ Llamada a la API de Servicios (que ya existe en tu Backend)
                const response = await api.get('/servicios/');
                
                // Asigna un ícono basado en el nombre (lógica visual)
                const getIcon = (name) => {
                    if (name.toLowerCase().includes('spa') || name.toLowerCase().includes('masaje')) return <FaSpa />;
                    if (name.toLowerCase().includes('restaurant') || name.toLowerCase().includes('cena')) return <FaUtensils />;
                    if (name.toLowerCase().includes('evento') || name.toLowerCase().includes('salon')) return <FaRegCalendarCheck />;
                    return <FaCocktail />;
                };

                const enrichedServices = response.data.map(service => ({
                    ...service,
                    serviceIcon: getIcon(service.nombre)
                }));

                setServices(enrichedServices);
            } catch (err) {
                // Este es el error que viste en tu log
                setError('Error al cargar los servicios. El Backend falló.');
                console.error("Error fetching services:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []); 

    if (loading) return <p style={{...style.container, textAlign: 'center', fontSize: '1.5rem'}}>Cargando experiencias...</p>;
    if (error) return <p style={{...style.container, textAlign: 'center', color: 'red', fontSize: '1.5rem'}}>{error}</p>;
    if (services.length === 0) return <p style={{...style.container, textAlign: 'center', fontSize: '1.5rem'}}>No hay servicios adicionales definidos en la base de datos.</p>;

    const formatCLP = (amount) => {
        return new Intl.NumberFormat('es-CL', { 
          style: 'currency', 
          currency: 'CLP',
          minimumFractionDigits: 0
        }).format(parseFloat(amount));
    };

    return (
        <div style={style.container}>
            <div style={style.header}>
                <h1 style={style.title}>Nuestras Experiencias Exclusivas</h1>
                <p style={style.subtitle}>Complementa tu estadía con nuestro Restaurant gourmet, Spa y Tinajas climatizadas.</p>
            </div>

            <div style={style.cardGrid}>
                {services.map(service => (
                    <div key={service.id} style={style.card}>
                        
                        <div style={style.cardContent}>
                            <h2 style={style.cardTitle}>
                                {service.serviceIcon} 
                                {service.nombre}
                            </h2>
                            
                            {/* ⚠️ Mostramos la descripción de la API (si existe) */}
                            <p style={style.cardDescription}>
                                {service.descripcion || "Disfruta de nuestros servicios exclusivos."}
                            </p>
                        </div>
                        
                        <div style={style.cardFooter}>
                            {/* ⚠️ Mostramos el precio de la API */}
                            {formatCLP(service.precio)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;