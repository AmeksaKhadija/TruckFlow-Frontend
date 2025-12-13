import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Inscription réussie ! Veuillez vous connecter.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input type="text" placeholder="Nom" {...register('nom', { required: true })} style={inputStyle} />
        <input type="text" placeholder="Prénom" {...register('prenom', { required: true })} style={inputStyle} />
        <input type="email" placeholder="Email" {...register('email', { required: true })} style={inputStyle} />
        <input type="password" placeholder="Mot de passe" {...register('password', { required: true, minLength: 6 })} style={inputStyle} />
        
        <select {...register('role', { required: true })} style={inputStyle}>
          <option value="chauffeur">Chauffeur</option>
        </select>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Register;