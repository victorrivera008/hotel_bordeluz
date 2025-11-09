import React, { useState } from 'react';
import api from '../services/api';
import SearchForm from './SearchForm'; 
import ConfirmationModal from './ConfirmationModal'; 
import { useAuth } from '../context/AuthContext';
import { FaWifi, FaCoffee, FaTemperatureHigh, FaUtensils, FaUser, FaExpand, FaTree } from 'react-icons/fa'; 

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
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        },
        display: 'flex',
        flexDirection: 'column',
    },
    cardImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
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
    },
    cardFeatures: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '15px',
        fontSize: '0.9rem',
        color: '#666',
        flexGrow: 1, 
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
        borderTop: '1px solid #EEE',
        paddingTop: '10px',
    },
    includeItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '5px',
        color: '#4A2A1A',
        fontSize: '0.95rem',
    },
    cardFooter: {
        marginTop: '20px',
        borderTop: '1px solid #EEE',
        paddingTop: '15px',
        textAlign: 'center',
    },
    priceTag: {
        color: '#D4AF37',
        fontSize: '1.8rem',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#4A2A1A',
        color: 'white',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '15px',
    },
    buttonLogin: {
        backgroundColor: '#f0f0f0', 
        color: '#4A2A1A', 
        border: '1px solid #4A2A1A', 
        padding: '12px 25px',
        borderRadius: '5px', 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        fontSize: '1rem',
        marginTop: '15px',
    }
};

const BookingPage = ({ triggerLogin }) => {
    const { isAuthenticated, userInfo } = useAuth();
    const [availableRooms, setAvailableRooms] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState(null); 

    const [selectedRoom, setSelectedRoom] = useState(null); 
    const [showConfirmation, setShowConfirmation] = useState(false);

    const getIcon = (feature) => {
        switch (feature) {
            case 'Wifi': return <FaWifi color="#D4AF37" />;
            case 'Desayuno incluido': return <FaCoffee color="#D4AF37" />;
            case 'Climatización': return <FaTemperatureHigh color="#D4AF37" />;
            case 'Minibar': return <FaUtensils color="#D4AF37" />;
            case 'Vista al Lago': return <FaTree color="#D4AF37" />;
            case 'Jardín': return <FaTree color="#D4AF37" />;
            case '1 Persona': case '2 Personas': case '4 Personas': return <FaUser color="#D4AF37" />;
            case '30 m²': return <FaExpand color="#D4AF37" />;
            default: return null;
        }
    };

    const formatCLP = (amount) => {
        return new Intl.NumberFormat('es-CL', { 
          style: 'currency', 
          currency: 'CLP',
          minimumFractionDigits: 0
        }).format(parseFloat(amount));
    };

    const handleSearch = async (checkIn, checkOut) => {
        setLoading(true);
        setError(null);
        setAvailableRooms([]);
        setSearchParams({ checkIn, checkOut }); 

        try {
            const response = await api.get('/reservas/disponibilidad/', {
                params: {
                    check_in: checkIn,
                    check_out: checkOut,
                },
            });
            
            setAvailableRooms(response.data);
            if (response.data.length === 0) {
                setError('No se encontraron habitaciones disponibles para esas fechas.');
            }
        } catch (err) {
            setError('Error al consultar la disponibilidad.');
            console.error("Error fetching availability:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReservationClick = (room) => {
        if (!isAuthenticated) {
            triggerLogin();
            return;
        }
        setSelectedRoom(room);
        setShowConfirmation(true);
    };

    const diffDays = searchParams ? Math.ceil(Math.abs(new Date(searchParams.checkOut) - new Date(searchParams.checkIn)) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <div style={style.container}>
            <div style={style.header}>
                <h1 style={style.title}>Reservar Online</h1>
                <p style={style.subtitle}>
                    Selecciona tus fechas para ver la disponibilidad en tiempo real y añadir servicios.
                </p>
            </div>

            <SearchForm onSearch={handleSearch} isLoading={loading} />

            {loading && <p style={{textAlign: 'center', fontSize: '1.2rem'}}>Buscando...</p>}
            {error && <p style={{textAlign: 'center', color: 'red'}}>{error}</p>}

            {availableRooms.length > 0 && searchParams && (
                <>
                    <h3 style={{...style.subtitle, textAlign: 'left', marginTop: '30px', borderBottom: '1px solid #D4AF37', paddingBottom: '10px'}}>
                        Opciones Disponibles ({diffDays} Noches)
                    </h3>
                    <div style={style.cardGrid}>
                        {availableRooms.map(room => {
                            const tipo = room.tipo_detalle;
                            const precioTotal = parseFloat(tipo.precio_base) * diffDays;
                            return (
                                <div key={room.id} style={style.roomCard}>
                                    {tipo.imagen && <img src={tipo.imagen} alt={tipo.nombre} style={style.cardImage} />}
                                    <div style={style.cardContent}>
                                        <h2 style={style.cardTitle}>{tipo.nombre} ({room.numero})</h2>
                                        <div style={style.cardFeatures}>
                                            <span style={style.featureItem}>{getIcon(`${tipo.capacidad_maxima} Personas`)} {tipo.capacidad_maxima} Personas</span>
                                            <span style={style.featureItem}>{getIcon(`${tipo.metros_cuadrados} m²`)} {tipo.metros_cuadrados} m²</span>
                                            <span style={style.featureItem}>{getIcon(tipo.vista)} {tipo.vista}</span>
                                        </div>
                                        <ul style={style.includeList}>
                                            {tipo.servicios_incluidos.map((servicio, index) => (
                                                <li key={index} style={style.includeItem}>
                                                    {getIcon(servicio.nombre)} {servicio.nombre}
                                                </li>
                                            ))}
                                        </ul>
                                        <div style={style.cardFooter}>
                                            <p style={style.priceTag}>Total: {formatCLP(precioTotal)}</p>
                                            <button
                                                style={isAuthenticated ? style.button : style.buttonLogin}
                                                onClick={() => handleReservationClick(room)}
                                            >
                                                {isAuthenticated ? 'Seleccionar y Reservar' : 'Reservar (Inicia Sesión)'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {showConfirmation && selectedRoom && (
                <ConfirmationModal 
                    room={selectedRoom}
                    checkIn={searchParams.checkIn}
                    checkOut={searchParams.checkOut}
                    diffDays={diffDays}
                    onClose={() => setShowConfirmation(false)} 
                    triggerLogin={triggerLogin} 
                />
            )}
        </div>
    );
};

export default BookingPage;