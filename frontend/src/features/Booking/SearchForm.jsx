import React, { useState } from 'react';

const style = {
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

const SearchForm = ({ onSearch, isLoading }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!checkIn || !checkOut) {
      setError('Por favor, selecciona ambas fechas.');
      return;
    }

    onSearch(checkIn, checkOut);
  };

  return (
    <div>
        <form onSubmit={handleSearch} style={style.form}>
            <div style={style.inputGroup}>
                <label>Check-in</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required style={style.input} />
            </div>
            <div style={style.inputGroup}>
                <label>Check-out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required style={style.input} />
            </div>
            <button type="submit" disabled={isLoading} style={style.button}>
                {isLoading ? 'Buscando...' : 'Buscar Disponibilidad'}
            </button>
        </form>
        {error && <p style={{ color: '#A52A2A', fontWeight: 'bold' }}>{error}</p>}
    </div>
  );
};

export default SearchForm;