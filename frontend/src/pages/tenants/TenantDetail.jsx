
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

    if (loading) return <p>Loading tenant...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!tenant) return <p>Tenant not found.</p>;

    return (
        <div>
            <Link to="/tenants" className="text-blue-600">
                ← Back to Tenants
            </Link>

            <div className="bg-white p-6 rounded-xl shadow-sm mt-5">
                <h2 className="text-2xl font-bold">{tenant.full_name}</h2>

                <div className="mt-5 space-y-3">
                    <p><strong>Email:</strong> {tenant.email}</p>
                    <p><strong>Phone:</strong> {tenant.phone}</p>
                    <p><strong>Address:</strong> {tenant.address}</p>
                </div>

                <div className="flex gap-3 mt-6">
                    <Link
                        to={`/tenants/${tenant.id}/edit`}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Edit Tenant
                    </Link>

                    <Link
                        to={`/tenants/${tenant.id}/documents`}
                        className="bg-gray-800 text-white px-5 py-2 rounded-lg"
                    >
                        Manage Documents
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TenantDetail;
