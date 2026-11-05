import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTenancy } from "../../services/tenancyService";

export default function TenancyDetail() {
    const { tenancyId } = useParams();
    const [tenancy, setTenancy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTenancy = async () => {
            try {
                const response = await getTenancy(tenancyId);
                setTenancy(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load tenancy.");
            } finally {
                setLoading(false);
            }
        };

        loadTenancy();
    }, [tenancyId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-[#815854] font-medium text-sm animate-pulse">
                    Loading tenancy...
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

    if (!tenancy) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-0 py-6">
                <div className="p-6 bg-[#F9EBDE] border border-[#815854]/20 rounded-xl text-center text-[#815854] font-medium">
                    Tenancy not found.
                </div>
            </div>
        );
    }

    const fields = [
        ["Tenant", tenancy.tenant_name],
        ["Property", tenancy.property_name],
        ["Unit", tenancy.unit_number],
        ["Start Date", tenancy.start_date],
        ["End Date", tenancy.end_date],
        ["Monthly Rent", `₹${tenancy.monthly_rent}`],
        ["Rent Due Day", tenancy.rent_due_day],
        ["Status", tenancy.status],
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8 space-y-4">
            {/* Header & Navigation */}
            <div className="flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <Link
                    to="/tenancies"
                    className="text-xs font-semibold text-[#815854]/70 hover:text-[#815854] underline transition-colors"
                >
                    &larr; Back to Tenancies
                </Link>

                <Link
                    to={`/tenancies/${tenancyId}/edit`}
                    className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-4 py-2 rounded-md text-xs shadow-sm transition-all"
                >
                    Edit Tenancy
                </Link>
            </div>

            {/* Title Section */}
            <div className="flex items-center justify-between pt-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Tenancy Details
                </h1>
            </div>

            {/* Details Card Grid */}
            <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl p-5 sm:p-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {fields.map(([label, value]) => (
                        <div
                            key={label}
                            className="bg-white/70 border border-[#815854]/10 p-3.5 rounded-lg flex flex-col justify-between space-y-1 shadow-xs"
                        >
                            <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider">
                                {label}
                            </span>
                            <span className="text-sm font-semibold text-[#815854]">
                                {value ?? "-"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}