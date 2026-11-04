
import api from "./api";

export const loginAdmin = async (credentials) => {

    const response = await api.post(
        "/auth/login/",
        credentials
    );

    const { user, tokens } = response.data.data;

    // Store tokens
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);

    // Store admin details
    localStorage.setItem("admin", JSON.stringify(user));

    return response.data;
};


// Get logged-in admin profile
export const getAdminProfile = async () => {

    const response = await api.get("/auth/profile/");

    return response.data;
};


// Admin logout
export const logoutAdmin = async () => {

    const refreshToken = localStorage.getItem("refresh_token");

    try {

        if (refreshToken) {
            await api.post("/auth/logout/", {
                refresh: refreshToken,
            });
        }

    } finally {

        // Clear local authentication data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("admin");

    }
};


// Check authentication
export const isAuthenticated = () => {

    return Boolean(localStorage.getItem("access_token"));

};


// Get stored admin details
export const getStoredAdmin = () => {

    const admin = localStorage.getItem("admin");

    return admin ? JSON.parse(admin) : null;

};
