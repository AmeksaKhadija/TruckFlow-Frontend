import api from './api';

export const getAllChauffeurs = async () => {
    const response = await api.get('/users/chauffeurs');
    return response.data;
};

export const createChauffeur = async (data) => {
    const payload = { ...data, role: 'chauffeur' };
    const response = await api.post('/auth/register', payload);
    return response.data;
};

export const updateChauffeur = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};
export const deleteChauffeur = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};