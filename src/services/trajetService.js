import api from './api';

export const getAllTrajets = async () => {
    const response = await api.get('/trajets');
    return response.data;
};
export const getGlobalStats = async () => {
    const response = await api.get('/trajets/stats/global');
    return response.data;
};
export const createTrajet = async (data) => {
    const response = await api.post('/trajets', data);
    return response.data;
};

export const updateTrajet = async (id, data) => {
    const response = await api.put(`/trajets/${id}`, data);
    return response.data;
};

export const deleteTrajet = async (id) => {
    const response = await api.delete(`/trajets/${id}`);
    return response.data;
};

export const getTrajetsByChauffeur = async (chauffeurId) => {
    const response = await api.get(`/trajets/chauffeur/${chauffeurId}`);
    return response.data;
};

// ✅ Mettre à jour le statut (Démarrer / Terminer)
export const updateTrajetStatut = async (id, data) => {
    const response = await api.patch(`/trajets/${id}/statut`, data);
    return response.data;
};