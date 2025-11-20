import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaCalendarAlt, FaBed, FaConciergeBell } from 'react-icons/fa';
import AddServicesModal from '../features/Booking/AddServicesModal'; 

const style = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '60px 20px',
        backgroundColor: '#F4E8D8',
        minHeight: '80vh',
    },
    title: {
        color: '#4A2A1A',
        fontSize: '2.5rem',
        borderBottom: '3px solid #D4AF37',
        display: 'inline-block',
        marginBottom: '30px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderLeft: '5px solid #D4AF37',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #EEE',
        paddingBottom: '10px',
        marginBottom: '10px',
    },
    code: { fontWeight: 'bold', fontSize: '1.1rem', color: '#4A2A1A' },
    status: (status) => ({
        padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold',
        backgroundColor: status === 'CONFIRMADA' ? '#D4EDDA' : '#FFF3CD',
        color: status === 'CONFIRMADA' ? '#155724' : '#856404',
    }),
    infoRow: { display: 'flex', alignItems: 'center', gap: '10px', color: '#555' },
    button: {
        backgroundColor: '#4A2A1A',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        alignSelf: 'flex-end',
        marginTop: '10px',
    }
};

const MyReservationsPage = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReserva, setSelectedReserva] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchReservas = async () => {
        try {
            const response = await api.get('/reservas/mis_reservas/');
            setReservas(response.data);
        } catch (error) {
            console.error("Error al cargar reservas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    const handleOpenModal = (reserva) => {
        setSelectedReserva(reserva);
        setIsModalOpen(true);
    };

    const handleCloseModal = (updated) => {
        setIsModalOpen(false);
        setSelectedReserva(null);
        if (updated) fetchReservas(); 
    };

    if (loading) return <div style={style.container}>Cargando tus reservas...</div>;

    return (
        <div style={style.container}>
            <h1 style={style.title}>Mis Reservas</h1>
            
            {reservas.length === 0 ? (
                <p>No tienes reservas activas. ¡Reserva tu estadía hoy!</p>
            ) : (
                reservas.map(reserva => (
                    <div key={reserva.id} style={style.card}>
                        <div style={style.cardHeader}>
                            <span style={style.code}>#{reserva.codigo_reserva}</span>
                            <span style={style.status(reserva.estado)}>{reserva.estado}</span>
                        </div>
                        
                        <div style={style.infoRow}>
                            <FaCalendarAlt color="#D4AF37"/>
                            <span>{reserva.fecha_checkin} al {reserva.fecha_checkout}</span>
                        </div>
                        
                        <div style={style.infoRow}>
                            <FaBed color="#D4AF37"/>
                            <span>Habitación #{reserva.habitacion} (Tipo: {reserva.habitacion_tipo_nombre || 'Estandar'})</span>
                        </div>

                        <div style={style.infoRow}>
                            <strong>Total Pagado:</strong> ${parseInt(reserva.total_pagado).toLocaleString('es-CL')}
                        </div>

                        <button style={style.button} onClick={() => handleOpenModal(reserva)}>
                            <FaConciergeBell style={{marginRight:'5px'}}/> Solicitar Servicios Extra
                        </button>
                    </div>
                ))
            )}

            {isModalOpen && selectedReserva && (
                <AddServicesModal 
                    reserva={selectedReserva} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
};

export default MyReservationsPage;