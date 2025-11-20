import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { FaUser, FaExpand, FaTree, FaBed } from 'react-icons/fa';

const style = {
    resultHeader: {
        color: '#4A2A1A',
        marginBottom: '20px',
        fontSize: '1.5rem',
        borderBottom: '1px solid #D4AF37',
        paddingBottom: '10px'
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
        border: '1px solid #EAEAEA',
        transition: 'transform 0.3s, box-shadow 0.3s',
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
    cardFooter: {
        marginTop: 'auto',
        borderTop: '1px solid #EEE',
        paddingTop: '15px',
        textAlign: 'center',
    },
    priceTag: {
        color: '#D4AF37',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    button: {
        backgroundColor: '#4A2A1A',
        color: 'white',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer',
        width: '100%',
    },
};

const RoomList = ({ rooms, checkIn, checkOut, triggerLogin }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  const handleReservationClick = (room) => {
    setSelectedRoom(room);
    setShowConfirmation(true);
  };

  return (
    <div>
      <h3 style={style.resultHeader}>Opciones Disponibles ({diffDays} Noches)</h3>

      <div style={style.cardGrid}>
        {rooms.map((room) => {
          const tipo = room.tipo_detalle;
          if (!tipo) return null; 

          const precioTotal = parseFloat(tipo.precio_base) * diffDays;

          return (
            <div key={room.id} style={style.roomCard}>
              <div style={style.cardImage}>
                  <img 
                    src={`https://via.placeholder.com/400x250/E0E0E0/888888?text=${tipo.nombre.replace(' ', '+')}`} 
                    alt={tipo.nombre}
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
              </div>

              <div style={style.cardContent}>
                <h2 style={style.cardTitle}><FaBed /> {tipo.nombre}</h2>
                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '10px'}}>Habitación #{room.numero}</p>

                <div style={style.cardFeatures}>
                  <span style={style.featureItem}><FaUser color="#D4AF37" /> {tipo.capacidad_maxima} Personas</span>
                  <span style={style.featureItem}><FaExpand color="#D4AF37" /> {tipo.precio_base ? 'Vista Lago' : 'Vista Jardín'}</span>
                </div>

                <div style={style.cardFooter}>
                    <p style={style.priceTag}>Total: {formatCLP(precioTotal)}</p>

                    <button
                        onClick={() => handleReservationClick(room)}
                        style={style.button}
                    >
                        Seleccionar y Añadir Servicios
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showConfirmation && selectedRoom && (
        <ConfirmationModal
            room={selectedRoom}
            checkIn={checkIn}
            checkOut={checkOut}
            diffDays={diffDays}
            onClose={() => setShowConfirmation(false)}
            triggerLogin={triggerLogin} 
        />
      )}
    </div>
  );
};

export default RoomList;