import api from './api';

export const createOrderAPI = (payload) => api.post('/orders', payload);
export const getMyOrdersAPI = () => api.get('/orders/my');
export const getOrderByIdAPI = (id) => api.get(`/orders/${id}`);

// Admin
export const getAllOrdersAPI = (params = {}) => api.get('/orders', { params });
export const updateOrderStatusAPI = (id, payload) =>
  api.put(`/orders/${id}/status`, payload);
export const getAdminStatsAPI = () => api.get('/orders/stats');
