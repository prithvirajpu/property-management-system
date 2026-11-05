
import api from "./api";

export const getTenancies = async (params = {}) => {
    const response = await api.get("/tenancies/", { params });
    return response.data;
};

export const getTenancy = async (id) => {
    const response = await api.get(`/tenancies/${id}/`);
    return response.data;
};

export const createTenancy = async (data) => {
    const response = await api.post("/tenancies/", data);
    return response.data;
};

export const updateTenancy = async (id, data) => {
    const response = await api.put(`/tenancies/${id}/`, data);
    return response.data;
};

export const patchTenancy = async (id, data) => {
    const response = await api.patch(`/tenancies/${id}/`, data);
    return response.data;
};

export const deleteTenancy = async (id) => {
    const response = await api.delete(`/tenancies/${id}/`);
    return response.data;
};
