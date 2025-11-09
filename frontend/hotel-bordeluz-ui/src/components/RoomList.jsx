import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const style = {
  resultHeader: {
    color: '#4A2A1A',
    marginBottom: '20px',
  },
  roomCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #E0E0E0',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    backgroundColor: 'white',
    transition: 'box-shadow 0.3s',
  },
  roomInfo: {
    flexGrow: 1,
    textAlign: 'left',
  },
  roomTitle: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '5px',
  },
  priceContainer: {
    textAlign: 'center', 
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#D4AF37', 
    marginBottom: '8px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#4A2A1A',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  buttonLogin: {
    padding: '10px 15px',
    backgroundColor: '#f0f0f0',
    color: '#4A2A1A',
    border: '1px solid #4A2A1A',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

const RoomList = ({ rooms, checkIn, checkOut, triggerLogin }) => {
  const { isAuthenticated, userInfo } = useAuth();
  const [reservationStatus, setReservationStatus] = useState({}); 
  const [loadingRoomId, setLoadingRoomId] = useState(null); 

  const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (rooms.length === 0) return <p>No hay habitaciones disponibles para el rango seleccionado.</p>;

  const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  const handleReservation = async (roomId) => {
    setLoadingRoomId(roomId);
    setReservationStatus({}); 

    if (!isAuthenticated) {
      triggerLogin(); 
      setLoadingRoomId(null);
      return;
    }

    try {
      const response = await api.post('/reservas/', {
        habitacion: roomId,
        fecha_checkin: new Date(checkIn).toISOString().split('T')[0],
        fecha_checkout: new Date(checkOut).toISOString().split('T')[0],
        servicios: [], 
      });

      setReservationStatus({
        success: `Reserva #${response.data.reserva.codigo_reserva} CONFIRMADA a nombre de ${userInfo.username}. Total: ${formatCLP(response.data.reserva.total_pagado)}`,
        status: 'success'
      });
      
    } catch (err) {
      const msg = err.response?.data?.cliente?.[0] || err.message || "Error desconocido al procesar la reserva.";
      setReservationStatus({ error: `Fallo: ${msg}`, status: 'error' });
      console.error("Error al crear reserva:", err.response || err);
    } finally {
      setLoadingRoomId(null);
    }
  };
  
  return (
    <div>
      <h3 style={style.resultHeader}>Opciones Disponibles ({diffDays} Noches)</h3>
      {reservationStatus.error && <p style={{color: '#A52A2A', fontWeight: 'bold'}}>⚠️ {reservationStatus.error}</p>}
      {reservationStatus.success && <p style={{color: 'darkgreen', fontWeight: 'bold'}}>✅ {reservationStatus.success}</p>}

      {rooms.map((room) => {
        const tipo = room.tipo_detalle;
        const precioTotal = parseFloat(tipo.precio_base) * diffDays;
        const isProcessing = loadingRoomId === room.id;
        
        return (
          <div key={room.id} style={style.roomCard}>
            
            <div style={style.roomInfo}>
              <h4 style={style.roomTitle}>{tipo.nombre}</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Máximo {tipo.capacidad_maxima} personas.</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Precio por noche: {formatCLP(tipo.precio_base)}</p>
              <p style={{ marginTop: '5px', fontSize: 'small' }}>Habitación # {room.numero}</p>
            </div>
            
            <div style={style.priceContainer}>
                <div style={style.totalPrice}>Total: {formatCLP(precioTotal)}</div>
                
                {!isAuthenticated ? (
                  <button 
                    style={style.buttonLogin} 
                    onClick={triggerLogin} 
                  >
                    Reservar (Inicia Sesión)
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => handleReservation(room.id)} 
                      disabled={isProcessing}
                      style={style.button}>
                      {isProcessing ? 'Procesando Pago...' : 'Reservar Ahora'}
                    </button>
                    <p style={{ marginTop: '5px', fontSize: 'small', color: 'darkgreen' }}>Logueado como: {userInfo.username}</p>
                  </>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomList;