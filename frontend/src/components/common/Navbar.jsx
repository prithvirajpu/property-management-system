
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
                Property Management
            </h1>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                    {user?.email}
                </span>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
