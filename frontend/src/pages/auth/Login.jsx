import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(formData);
            navigate("/dashboard");
        } catch (err) {
            const backendError = err.response?.data;

            setError(
                backendError?.message ||
                backendError?.errors?.detail ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9EBDE]/40 px-4 py-12">
            <div className="w-full max-w-md bg-[#F9EBDE] border border-[#815854]/20 p-8 sm:p-10 rounded-2xl shadow-xl backdrop-blur-sm">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#815854] text-[#F9EBDE] shadow-md mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#815854]">
                        Property Management
                    </h1>
                    <p className="text-[#815854]/70 font-medium mt-1.5 text-sm sm:text-base">
                        Admin Login Portal
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-800 rounded-r-lg text-sm font-medium shadow-sm flex items-center gap-2">
                        <svg className="w-5 h-5 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-[#815854] mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full bg-white border border-[#815854]/25 rounded-lg px-4 py-3 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-2 focus:ring-[#815854] focus:border-transparent transition-all shadow-sm text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#815854] mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full bg-white border border-[#815854]/25 rounded-lg px-4 py-3 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-2 focus:ring-[#815854] focus:border-transparent transition-all shadow-sm text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm tracking-wide mt-2"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;