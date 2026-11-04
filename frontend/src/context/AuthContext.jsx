import { createContext, useContext, useEffect, 
            useState,} from "react";

import { loginAdmin, logoutAdmin, getAdminProfile, 
    getStoredAdmin, isAuthenticated as checkAuth,
        } from "../services/authServices";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredAdmin);
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth);
    const [loading, setLoading] = useState(true);

    // Check authentication when the application starts
    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem("access_token");

            if (!accessToken) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const response = await getAdminProfile();

                // Supports common API response structures
                const profileData =
                    response?.data?.user ||
                    response?.data ||
                    response?.user ||
                    getStoredAdmin();

                if (profileData) {
                    setUser(profileData);
                    localStorage.setItem(
                        "admin",
                        JSON.stringify(profileData)
                    );
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Authentication check failed:", error);

                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("admin");

                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login
    const login = async (credentials) => {
        const response = await loginAdmin(credentials);

        const userData = response.data.user;

        setUser(userData);
        setIsAuthenticated(true);

        return response;
    };

    // Logout
    const logout = async () => {
        try {
            await logoutAdmin();
        } catch (error) {
            console.error("Logout API failed:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{user,isAuthenticated,loading,login,logout,}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)