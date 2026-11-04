
import api from "./api";

export const getUnits = async (params = {}) => {
    const response = await api.get("/units/", { params });
    return response.data;
};

export const getUnit = async (unitId) => {
    const response = await api.get(`/units/${unitId}/`);
    return response.data;
};

export const createUnit = async (unitData) => {
    const response = await api.post("/units/", unitData);
    return response.data;
};

export const updateUnit = async (unitId, unitData) => {
    const response = await api.put(`/units/${unitId}/`, unitData);
    return response.data;
};

export const patchUnit = async (unitId, unitData) => {
    const response = await api.patch(`/units/${unitId}/`, unitData);
    return response.data;
};

export const deleteUnit = async (unitId) => {
    const response = await api.delete(`/units/${unitId}/`);
    return response.data;
};
