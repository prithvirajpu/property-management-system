import { NavLink } from "react-router-dom";

const links = [
    { 
        name: "Dashboard", 
        path: "/dashboard",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    { 
        name: "Properties", 
        path: "/properties",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        )
    },
    { 
        name: "Units", 
        path: "/units",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
        )
    },
    { 
        name: "Tenants", 
        path: "/tenants",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        )
    },
    { 
        name: "Tenancies", 
        path: "/tenancies",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )
    },
];

const Sidebar = () => {
    return (
        <aside className="w-full md:w-64 bg-[#F9EBDE] border-b md:border-b-0 md:border-r border-[#815854]/15 min-h-0 md:min-h-[calc(100vh-64px)] p-3 md:p-4 shadow-sm flex-shrink-0">
            <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible space-x-2 md:space-x-0 md:space-y-2 pb-2 md:pb-0 scrollbar-none">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                                isActive
                                    ? "bg-[#815854] text-[#F9EBDE] shadow-sm font-semibold"
                                    : "text-[#815854] hover:bg-[#815854]/10 hover:text-[#815854]"
                            }`
                        }
                    >
                        <span className="flex-shrink-0">{link.icon}</span>
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;