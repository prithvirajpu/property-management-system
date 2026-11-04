import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTenant } from "../../services/tenantService";

const TenantDetail = () => {
    const { tenantId } = useParams();

    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const response = await getTenant(tenantId);
                setTenant(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load tenant.");
            } finally {
                setLoading(false);
            }
        };

        fetchTenant();
    }, [tenantId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-[#815854] font-medium text-sm animate-pulse">
                    Loading tenant details...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-0 py-6">
                <div className="p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-800 rounded-r-lg text-sm font-medium shadow-sm">
                    {error}
                </div>
            </div>
        );
    }

    if (!tenant) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-0 py-6">
                <div className="p-6 bg-[#F9EBDE] border border-[#815854]/20 rounded-xl text-center text-[#815854] font-medium">
                    Tenant not found.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8 space-y-4">
            {/* Header & Navigation */}
            <div className="flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <Link
                    to="/tenants"
                    className="text-xs font-semibold text-[#815854]/70 hover:text-[#815854] underline transition-colors"
                >
                    &larr; Back to Tenants
                </Link>

                <div className="flex items-center gap-2">
                    <Link
                        to={`/tenants/${tenant.id}/edit`}
                        className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-4 py-2 rounded-md text-xs shadow-sm transition-all"
                    >
                        Edit Tenant
                    </Link>

                    <Link
                        to={`/tenants/${tenant.id}/documents`}
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 font-semibold px-4 py-2 rounded-md text-xs shadow-xs transition-colors"
                    >
                        Manage Documents
                    </Link>
                </div>
            </div>

            {/* Main Details Card */}
            <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl p-5 sm:p-6 shadow-sm space-y-6">
                {/* Title */}
                <div className="border-b border-[#815854]/15 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#815854]">
                        {tenant.full_name}
                    </h2>
                </div>

                {/* Details Section Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#815854]">
                    <div className="bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Email Address
                        </span>
                        <p className="font-medium text-[#815854]">{tenant.email}</p>
                    </div>

                    <div className="bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Phone Number
                        </span>
                        <p className="font-medium text-[#815854]">{tenant.phone}</p>
                    </div>

                    <div className="sm:col-span-2 bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Address
                        </span>
                        <p className="font-medium text-[#815854] leading-relaxed">
                            {tenant.address || "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantDetail;