import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
      login(response); // Mise à jour du contexte
      toast.success(`Bienvenue ${response.user.prenom} !`);
      
      // Redirection selon le rôle
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/chauffeur/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Connexion TrackFlow</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email</label>
          <input 
            type="email" 
            {...register('email', { required: true })} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Mot de passe</label>
          <input 
            type="password" 
            {...register('password', { required: true })} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default Login;