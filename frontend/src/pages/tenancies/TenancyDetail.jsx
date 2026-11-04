
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

    if (loading) return <p className="p-6">Loading tenancy...</p>;
    if (error) return <p className="p-6 text-red-600">{error}</p>;
    if (!tenancy) return <p className="p-6">Tenancy not found.</p>;

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
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tenancy Details</h1>
                <Link to={`/tenancies/${tenancyId}/edit`} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Edit Tenancy
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                {fields.map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b pb-3 gap-4">
                        <span className="font-medium text-gray-600">{label}</span>
                        <span className="text-right">{value ?? "-"}</span>
                    </div>
                ))}
            </div>

            <Link to="/tenancies" className="inline-block mt-5 text-blue-600">
                ← Back to Tenancies
            </Link>
        </div>
    );
}
