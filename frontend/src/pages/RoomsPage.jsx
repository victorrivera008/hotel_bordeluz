import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaUser, FaExpand, FaWifi, FaCoffee, FaBed, FaTree } from 'react-icons/fa';

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
    roomCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
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
        display: 'flex',
        flexDirection: 'column',
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
    cardFeatures: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '15px',
        fontSize: '0.9rem',
        color: '#666',
        paddingBottom: '15px',
        borderBottom: '1px solid #EEE',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    includeList: {
        listStyle: 'none',
        padding: 0,
        margin: '10px 0',
        flexGrow: 1, 
    },
    includeItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
        color: '#4A2A1A',
        fontSize: '0.95rem',
    },
    cardFooter: {
        marginTop: '20px',
        textAlign: 'center',
    },
    priceTag: {
        backgroundColor: '#D4AF37',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '5px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
    },
};


const RoomsPage = () => {
    const [roomTypes, setRoomTypes] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/tipos-habitacion/');
                setRoomTypes(response.data);
            } catch (err) {
                setError('Error al cargar los tipos de habitación.');
                console.error("Error fetching room types:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoomTypes();
    }, []); 

    if (loading) return <p style={{textAlign: 'center', padding: '100px', fontSize: '1.5rem'}}>Cargando habitaciones...</p>;
    if (error) return <p style={{textAlign: 'center', padding: '100px', color: 'red', fontSize: '1.5rem'}}>{error}</p>;
    if (roomTypes.length === 0) return <p style={{textAlign: 'center', padding: '100px', fontSize: '1.5rem'}}>No hay tipos de habitación definidos en la base de datos.</p>;

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
                <h1 style={style.title}>Nuestra Colección de Habitaciones</h1>
                <p style={style.subtitle}>Explora el lujo y confort en el corazón de la naturaleza del sur de Chile.</p>
            </div>

            <div style={style.cardGrid}>
                {roomTypes.map(tipo => (
                    <div key={tipo.id} style={style.roomCard}>
                        
                        <div style={{...style.cardImage, backgroundImage: `url(https://via.placeholder.com/400x250/69422F/FFFFFF?text=${tipo.nombre.replace(' ','+')})`}}></div>
                        
                        <div style={style.cardContent}>
                            <h2 style={style.cardTitle}><FaBed /> {tipo.nombre}</h2>
                            
                            <div style={style.cardFeatures}>
                                <span style={style.featureItem}><FaUser color="#D4AF37" /> {tipo.capacidad_maxima} Personas</span>
                                <span style={style.featureItem}><FaExpand color="#D4AF37" /> 30 m² (Ej)</span>
                                <span style={style.featureItem}><FaTree color="#D4AF37" /> Jardín (Ej)</span>
                            </div>
                            
                            <ul style={style.includeList}>
                                <li style={style.includeItem}><FaWifi /> Wifi</li>
                                <li style={style.includeItem}><FaCoffee /> Desayuno incluido</li>
                            </ul>
                            
                            <div style={style.cardFooter}>
                                <p style={style.priceTag}>Desde {formatCLP(tipo.precio_base)} / Noche</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomsPage;