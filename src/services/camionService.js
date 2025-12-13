import api from './api';

export const getAllCamions = async () => {
    const response = await api.get('/camions');
    return response.data;
};

export const createCamion = async (data) => {
    const response = await api.post('/camions', data);
    return response.data;
};

export const updateCamion = async (id, data) => {
  const response = await api.put(`/camions/${id}`, data);
  return response.data;
};

export const deleteCamion = async (id) => {
    const response = await api.delete(`/camions/${id}`);
    return response.data;
};