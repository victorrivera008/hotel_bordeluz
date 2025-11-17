// frontend/hotel-bordeluz-ui/src/features/Booking/BookingPage.jsx (CÓDIGO COMPLETO Y CORREGIDO)

import React, { useState } from 'react';
import api from '../../services/api';
import RoomList from './RoomList'; // Importa el RoomList (tu código)
import SearchForm from './SearchForm'; // Importa el SearchForm (corregido)
import { useAuth } from '../../context/AuthContext'; 

// --- Estilos ---
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
    }
};

const BookingPage = ({ triggerLogin }) => {
    const [availableRooms, setAvailableRooms] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState(null); 

    // ⚠️ FIX: Esta es la función "inteligente" que llama a la API
    const handleSearch = async (checkIn, checkOut) => {
        setLoading(true);
        setError(null);
        setAvailableRooms([]);
        setSearchParams({ checkIn, checkOut }); 

        try {
            // El Backend está funcionando y enviando datos
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

    return (
        <div style={style.container}>
            <div style={style.header}>
                <h1 style={style.title}>Reservar Online</h1>
                <p style={style.subtitle}>
                    Selecciona tus fechas para ver la disponibilidad en tiempo real y añadir servicios.
                </p>
            </div>

            {/* 1. El formulario "tonto" recibe la función 'handleSearch' */}
            <SearchForm onSearch={handleSearch} isLoading={loading} />

            {/* 2. Mensajes de estado */}
            {loading && <p style={{textAlign: 'center', fontSize: '1.2rem'}}>Buscando...</p>}
            {error && <p style={{textAlign: 'center', color: 'red', fontSize: '1.2rem'}}>{error}</p>}

            {/* 3. Renderiza RoomList (tu código) con los resultados */}
            {/* ⚠️ FIX: No se renderiza RoomList si no hay resultados */}
            {availableRooms.length > 0 && searchParams && (
                <RoomList 
                    rooms={availableRooms} 
                    checkIn={searchParams.checkIn} 
                    checkOut={searchParams.checkOut}
                    triggerLogin={triggerLogin} 
                />
            )}
        </div>
    );
};

export default BookingPage;