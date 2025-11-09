import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaSpa, FaUtensils, FaCocktail } from 'react-icons/fa';

const modalStyle = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 2000,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
    },
    content: {
        backgroundColor: 'white', padding: '30px', borderRadius: '8px',
        maxWidth: '600px', width: '90%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative', fontFamily: 'Georgia, serif',
    },
    closeButton: {
        position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none',
        fontSize: '1.5rem', cursor: 'pointer', color: '#4A2A1A',
    },
    header: { color: '#4A2A1A', borderBottom: '2px solid #D4AF37', paddingBottom: '10px' },
    sectionTitle: { color: '#4A2A1A', marginTop: '20px', borderBottom: '1px solid #EEE' },
    serviceItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F4E8D8' },
    priceTotal: { fontSize: '1.5rem', fontWeight: 'bold', color: '#D4AF37', textAlign: 'right', marginTop: '20px' },
    confirmButton: { padding: '12px 25px', backgroundColor: '#4A2A1A', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '1.1rem', marginTop: '20px' }
};

const formatCLP = (amount) => {
    if (isNaN(parseFloat(amount))) return '$ 0';
    return new Intl.NumberFormat('es-CL', { 
        style: 'currency', currency: 'CLP', minimumFractionDigits: 0 
    }).format(parseFloat(amount));
};


const ConfirmationModal = ({ room, checkIn, checkOut, diffDays, onClose, triggerLogin }) => {
    const { isAuthenticated, userInfo } = useAuth();
    const [allServices, setAllServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]); 
    const [error, setError] = useState('');
    const [reservationStatus, setReservationStatus] = useState(null); 

    const roomPrice = parseFloat(room.tipo_detalle.precio_base) * diffDays;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/servicios/');
                setAllServices(response.data);
            } catch (err) {
                setError('No se pudieron cargar los servicios adicionales.');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleServiceToggle = (service) => {
        setSelectedServices(prev => {
            const isSelected = prev.find(s => s.id === service.id);
            if (isSelected) {
                return prev.filter(s => s.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    const servicesPrice = selectedServices.reduce((total, s) => total + parseFloat(s.precio), 0);
    const totalPrice = roomPrice + servicesPrice;

    const handleFinalReservation = async () => {
        setLoading(true);
        setError('');

        if (!isAuthenticated) {
            triggerLogin();
            setLoading(false);
            return;
        }

        const servicesPayload = selectedServices.map(s => ({
            servicio_id: s.id,
            cantidad: 1 
        }));

        try {
            const response = await api.post('/reservas/', {
                habitacion: room.id, 
                fecha_checkin: checkIn,
                fecha_checkout: checkOut,
                servicios: servicesPayload, 
            });

            setReservationStatus({
                success: `¡Reserva #${response.data.reserva.codigo_reserva} CONFIRMADA! Total: ${formatCLP(response.data.reserva.total_pagado)}. Revisa tu email.`
            });
            
        } catch (err) {
            const msg = err.response?.data?.cliente?.[0] || err.message || "Error desconocido.";
            setError(`Fallo: ${msg}`);
            console.error("Error al crear reserva:", err.response || err);
        } finally {
            setLoading(false);
        }
    };
    
    if (reservationStatus?.success) {
        return (
            <div style={modalStyle.overlay}>
                <div style={modalStyle.content}>
                    <h2 style={{color: 'darkgreen'}}>✅ ¡Reserva Confirmada!</h2>
                    <p>{reservationStatus.success}</p>
                    <button onClick={onClose} style={{ ...modalStyle.confirmButton, backgroundColor: '#D4AF37' }}>Cerrar</button>
                </div>
            </div>
        );
    }

    return (
        <div style={modalStyle.overlay} onClick={onClose}>
            <div style={modalStyle.content} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={modalStyle.closeButton}>&times;</button>
                <h2 style={style.header}>Confirmar Reserva</h2>

                <div>
                    <strong>Habitación:</strong> {room.tipo_detalle.nombre} (Noches: {diffDays})<br/>
                    <strong>Precio Habitación:</strong> {formatCLP(roomPrice)}
                </div>

                <h3 style={style.sectionTitle}>Añadir Servicios Adicionales</h3>
                {loading && <p>Cargando servicios...</p>}
                <div>
                    {allServices.map(service => (
                        <div key={service.id} style={style.serviceItem}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    onChange={() => handleServiceToggle(service)}
                                />
                                {service.nombre}
                            </label>
                            <span>{formatCLP(service.precio)}</span>
                        </div>
                    ))}
                </div>

                <div style={style.priceTotal}>
                    Total Estimado: {formatCLP(totalPrice)}
                </div>

                {error && <p style={{color: 'red'}}>⚠️ {error}</p>}

                <button 
                    onClick={handleFinalReservation} 
                    disabled={loading}
                    style={modalStyle.confirmButton}
                >
                    {loading ? 'Procesando...' : `Confirmar y Pagar ${formatCLP(totalPrice)}`}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;