
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTenants, deleteTenant } from "../../services/tenantService";

const TenantList = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const response = await getTenants();
            setTenants(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load tenants.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const handleDelete = async (tenantId) => {
        if (!window.confirm("Are you sure you want to delete this tenant?")) {
            return;
        }

        try {
            await deleteTenant(tenantId);
            fetchTenants();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete tenant.");
        }
    };

    if (loading) return <p>Loading tenants...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Tenants</h2>
                    <p className="text-gray-500">Manage tenant information.</p>
                </div>

                <Link
                    to="/tenants/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Add Tenant
                </Link>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {tenants.length === 0 ? (
                <p className="text-gray-500">No tenants found.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Address</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tenants.map((tenant) => (
                                <tr key={tenant.id} className="border-t">
                                    <td className="p-4">{tenant.full_name}</td>
                                    <td className="p-4">{tenant.email}</td>
                                    <td className="p-4">{tenant.phone}</td>
                                    <td className="p-4">{tenant.address}</td>

                                    <td className="p-4">
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/tenants/${tenant.id}`}
                                                className="text-blue-600"
                                            >
                                                View
                                            </Link>

                                            <Link
                                                to={`/tenants/${tenant.id}/edit`}
                                                className="text-green-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(tenant.id)}
                                                className="text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TenantList;
