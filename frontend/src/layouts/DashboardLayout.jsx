import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#F9EBDE]/40 text-[#815854] flex flex-col">
            <Navbar />

            <div className="flex flex-col md:flex-row flex-1">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;