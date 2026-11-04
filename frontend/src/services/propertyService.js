
import api from "./api";

export const getProperties = async (params = {}) => {
    const response = await api.get("/properties/", { params });
    return response.data;
};

export const getProperty = async (propertyId) => {
    const response = await api.get(`/properties/${propertyId}/`);
    return response.data;
};

export const createProperty = async (propertyData) => {
    const response = await api.post("/properties/", propertyData);
    return response.data;
};

export const updateProperty = async (propertyId, propertyData) => {
    const response = await api.put(
        `/properties/${propertyId}/`,
        propertyData
    );
    return response.data;
};

export const patchProperty = async (propertyId, propertyData) => {
    const response = await api.patch(
        `/properties/${propertyId}/`,
        propertyData
    );
    return response.data;
};

export const deleteProperty = async (propertyId) => {
    const response = await api.delete(`/properties/${propertyId}/`);
    return response.data;
};
