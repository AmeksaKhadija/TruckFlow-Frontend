import api from './api';

export const getAllRemorques = async () => {
  const response = await api.get('/remorques');
  return response.data;
};

export const createRemorque = async (data) => {
  const response = await api.post('/remorques', data);
  return response.data;
};

export const updateRemorque = async (id, data) => {
  const response = await api.put(`/remorques/${id}`, data);
  return response.data;
};
export const deleteRemorque = async (id) => {
  const response = await api.delete(`/remorques/${id}`);
  return response.data;
};