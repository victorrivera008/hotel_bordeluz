import React, { useState } from 'react';
import api, { setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext'; 

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/token/', {
        username,
        password,
      });

      const accessToken = response.data.access;
      
      const userInfo = {
        id: response.data.user_id, 
        rol: response.data.rol, 
        username: username,
      };

      login(userInfo, accessToken); 
      
      setLoading(false);
      
      if (onSuccess) onSuccess(); 
      
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        setError('Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.');
      } else {
        setError('Ocurrió un error de conexión o del servidor.');
      }
      console.error("Error de Login:", err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{color: '#4A2A1A'}}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Usuario" required onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
        <input type="password" name="password" placeholder="Contraseña" required onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
        
        <button type="submit" disabled={loading} style={{ padding: '10px', width: '100%', backgroundColor: loading ? '#ccc' : '#D4AF37', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', margin: '15px 0 5px 0' }}>
          {loading ? 'Iniciando Sesión...' : 'Entrar'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
      
      <button 
        onClick={onSwitchToRegister} 
        style={{ 
            background: 'none', 
            border: 'none', 
            color: '#4A2A1A', 
            cursor: 'pointer', 
            textDecoration: 'underline', 
            width: '100%', 
            padding: '10px 0' 
        }}
      >
          ¿No tienes cuenta? Regístrate aquí
      </button>
    </div>
  );
};

export default Login;