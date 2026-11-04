
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {

        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest?._retry &&
            !originalRequest?.url?.includes("/auth/login/") &&
            !originalRequest?.url?.includes("/auth/refresh/")
        ) {

            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh_token");

            if (!refreshToken) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                window.location.href = "/login";

                return Promise.reject(error);
            }

            try {

                // Request a new access token
                const response = await axios.post(
                    `${BASE_URL}/auth/refresh/`,
                    {
                        refresh: refreshToken,
                    }
                );

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;

                localStorage.setItem(
                    "access_token",
                    newAccessToken
                );
                if (newRefreshToken) {
                    localStorage.setItem("refresh_token", newRefreshToken);
                }
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Retry the original request
                return api(originalRequest);

            } catch (refreshError) {

                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
