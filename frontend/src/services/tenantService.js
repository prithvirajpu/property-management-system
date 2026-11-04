
import api from "./api";

// Tenant CRUD
export const getTenants = async (params = {}) => {
    const response = await api.get("/tenants/", { params });
    return response.data;
};

export const getTenant = async (tenantId) => {
    const response = await api.get(`/tenants/${tenantId}/`);
    return response.data;
};

export const createTenant = async (tenantData) => {
    const response = await api.post("/tenants/", tenantData);
    return response.data;
};

export const updateTenant = async (tenantId, tenantData) => {
    const response = await api.put(`/tenants/${tenantId}/`, tenantData);
    return response.data;
};

export const patchTenant = async (tenantId, tenantData) => {
    const response = await api.patch(`/tenants/${tenantId}/`, tenantData);
    return response.data;
};

export const deleteTenant = async (tenantId) => {
    const response = await api.delete(`/tenants/${tenantId}/`);
    return response.data;
};

// Tenant Documents
export const getTenantDocuments = async (tenantId) => {
    const response = await api.get(`/tenants/${tenantId}/documents/`);
    return response.data;
};

export const uploadTenantDocument = async (tenantId, documentData) => {
    const response = await api.post(
        `/tenants/${tenantId}/documents/`,
        documentData
    );
    return response.data;
};

export const deleteTenantDocument = async (documentId) => {
    const response = await api.delete(
        `/tenants/documents/${documentId}/`
    );
    return response.data;
};
