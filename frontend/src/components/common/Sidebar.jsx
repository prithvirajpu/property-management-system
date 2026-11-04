
import { NavLink } from "react-router-dom";

const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Properties", path: "/properties" },
    { name: "Units", path: "/units" },
    { name: "Tenants", path: "/tenants" },
    { name: "Tenancies", path: "/tenancies" },
];

const Sidebar = () => {
    return (
        <aside className="w-60 min-h-[calc(100vh-64px)] bg-white shadow-sm p-4">
            <nav className="space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg ${
                                isActive
                                    ? "bg-blue-100 text-blue-700 font-semibold"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
