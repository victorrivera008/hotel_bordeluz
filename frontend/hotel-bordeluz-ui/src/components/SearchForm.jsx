import React, { useState } from 'react';
import api from '../services/api';
import RoomList from './RoomList'; 

const style = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#F7F7F7', 
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  header: {
    color: '#4A2A1A', 
    borderBottom: '2px solid #D4AF37', 
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-end',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginTop: '5px',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#D4AF37', 
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
};

const SearchForm = ({ triggerLogin }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDisponibilidad([]);

    if (!checkIn || !checkOut) {
      setError('Por favor, selecciona ambas fechas.');
      setLoading(false);
      return;
    }
    
    const checkInFormatted = new Date(checkIn).toISOString().split('T')[0];
    const checkOutFormatted = new Date(checkOut).toISOString().split('T')[0];

    try {
      const response = await api.get('/reservas/disponibilidad/', {
        params: {
          check_in: checkInFormatted,
          check_out: checkOutFormatted,
        },
      });

      setDisponibilidad(response.data);
      if (response.data.length === 0) {
        setError('No se encontraron habitaciones disponibles para esas fechas.');
      }
      
    } catch (err) {
      setError('Error al consultar la disponibilidad. Verifica que el Backend esté corriendo.');
      console.error("Error de disponibilidad:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={style.container}>
      <h2 style={style.header}>Encuentra tu Habitación</h2>
      <form onSubmit={handleSearch} style={style.form}>
        <div style={style.inputGroup}>
          <label>Check-in</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required style={style.input} />
        </div>
        <div style={style.inputGroup}>
          <label>Check-out</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required style={style.input} />
        </div>
        <button type="submit" disabled={loading} style={style.button}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p style={{ color: '#A52A2A', fontWeight: 'bold' }}>{error}</p>}
      
      {disponibilidad.length > 0 && 
        <RoomList 
          rooms={disponibilidad} 
          checkIn={checkIn} 
          checkOut={checkOut}
          triggerLogin={triggerLogin} 
        />
      }
    </div>
  );
};

export default SearchForm;