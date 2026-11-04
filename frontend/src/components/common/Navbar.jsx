import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/common/ConfirmModal";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogoutClick = () => {
        setConfirmOpen(true);
        setMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        setConfirmOpen(false);
        navigate("/login");
    };

    return (
        <nav className="bg-[#815854] text-[#F9EBDE] shadow-md border-b border-[#F9EBDE]/15 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Brand Logo & Title */}
                    <div className="flex items-center gap-3">
                        <div className="bg-[#F9EBDE] text-[#815854] p-2 rounded-lg font-bold text-lg flex items-center justify-center shadow-sm">
                            <svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                                />
                            </svg>
                        </div>
                        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-[#F9EBDE]">
                            Property Management
                        </h1>
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-5">
                        <div className="flex items-center gap-2 bg-[#F9EBDE]/10 border border-[#F9EBDE]/20 px-3.5 py-1.5 rounded-full text-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="font-medium text-[#F9EBDE]/90">
                                {user?.email}
                            </span>
                        </div>

                        <button
                            onClick={handleLogoutClick}
                            className="bg-[#F9EBDE] text-[#815854] hover:bg-white hover:shadow-md px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            type="button"
                            className="text-[#F9EBDE] hover:bg-[#F9EBDE]/10 p-2 rounded-lg focus:outline-none transition-colors"
                            aria-label="Toggle Navigation Menu"
                        >
                            <svg 
                                className="w-6 h-6" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#815854] border-t border-[#F9EBDE]/10 px-4 pt-3 pb-5 space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#F9EBDE]/10 text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="truncate text-[#F9EBDE]/90 font-medium">
                            {user?.email}
                        </span>
                    </div>

                    <button
                        onClick={handleLogoutClick}
                        className="w-full text-left bg-[#F9EBDE] text-[#815854] font-semibold px-4 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            )}

            {/* Confirm Logout Modal */}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Logout"
                message="Are you sure you want to logout ?"
                confirmText="Logout"
                onCancel={() => {
                    setConfirmOpen(false);
                }}
                onConfirm={handleLogout}
            />
        </nav>
    );
};

export default Navbar;