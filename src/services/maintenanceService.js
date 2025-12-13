import api from "./api";

// --- ALERTES ---
export const getMaintenanceAlerts = async () => {
  const response = await api.get("/maintenance/alertes");
  return response.data;
};

// --- RÈGLES ---
export const getAllRegles = async () => {
  const response = await api.get("/regles-maintenance");
  return response.data;
};

export const createRegle = async (data) => {
  const response = await api.post("/regles-maintenance", data);
  return response.data;
};

export const updateRegle = async (id, data) => {
  const response = await api.put(`/regles-maintenance/${id}`, data);
  return response.data;
};
export const deleteRegle = async (id) => {
  const response = await api.delete(`/regles-maintenance/${id}`);
  return response.data;
};
