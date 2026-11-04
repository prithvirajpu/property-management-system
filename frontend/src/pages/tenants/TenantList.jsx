
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTenants, deleteTenant } from "../../services/tenantService";

const TenantList = () => {
    const [tenants, setTenants] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTenants = async () => {
        try {
            setLoading(true);
            setError("");
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

    const filteredTenants = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return tenants;

        return tenants.filter((tenant) =>
            [
                tenant.full_name,
                tenant.email,
                tenant.phone,
                tenant.address,
            ].some((value) => String(value || "").toLowerCase().includes(query))
        );
    }, [tenants, search]);

    const handleDelete = async (tenantId) => {
        if (!window.confirm("Are you sure you want to delete this tenant?")) return;

        try {
            await deleteTenant(tenantId);
            setTenants((prev) => prev.filter((tenant) => tenant.id !== tenantId));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete tenant.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Tenants</h2>
                    <p className="text-gray-500">Manage tenant information.</p>
                </div>

                <Link to="/tenants/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Add Tenant
                </Link>
            </div>

            <div className="bg-white border rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, phone or address..."
                    className="border rounded-lg p-2 flex-1"
                />

                <button
                    onClick={() => setSearch("")}
                    className="border rounded-lg px-4 py-2 hover:bg-gray-50"
                >
                    Clear Search
                </button>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {loading ? (
                <p>Loading tenants...</p>
            ) : filteredTenants.length === 0 ? (
                <p className="text-gray-500">No matching tenants found.</p>
            ) : (
                <>
                    <p className="text-sm text-gray-500 mb-3">
                        {filteredTenants.length} of {tenants.length} tenants
                    </p>

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
                                {filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="border-t">
                                        <td className="p-4">{tenant.full_name}</td>
                                        <td className="p-4">{tenant.email}</td>
                                        <td className="p-4">{tenant.phone}</td>
                                        <td className="p-4">{tenant.address}</td>
                                        <td className="p-4">
                                            <div className="flex gap-3">
                                                <Link to={`/tenants/${tenant.id}`} className="text-blue-600">
                                                    View
                                                </Link>
                                                <Link to={`/tenants/${tenant.id}/edit`} className="text-green-600">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(tenant.id)} className="text-red-600">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default TenantList;
