
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTenancies, deleteTenancy } from "../../services/tenancyService";

export default function TenancyList() {
    const [tenancies, setTenancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTenancies = async () => {
        try {
            const response = await getTenancies();
            setTenancies(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load tenancies.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTenancies();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tenancy?")) return;

        try {
            await deleteTenancy(id);
            setTenancies((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete tenancy.");
        }
    };

    if (loading) return <p>Loading tenancies...</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tenancies</h1>
                <Link to="/tenancies/create" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Tenancy
                </Link>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {tenancies.length === 0 ? (
                <p>No tenancies found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3 border">Tenant</th>
                                <th className="p-3 border">Property</th>
                                <th className="p-3 border">Unit</th>
                                <th className="p-3 border">Monthly Rent</th>
                                <th className="p-3 border">Start Date</th>
                                <th className="p-3 border">End Date</th>
                                <th className="p-3 border">Status</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenancies.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-3 border">{item.tenant_name}</td>
                                    <td className="p-3 border">{item.property_name}</td>
                                    <td className="p-3 border">{item.unit_number}</td>
                                    <td className="p-3 border">₹{item.monthly_rent}</td>
                                    <td className="p-3 border">{item.start_date}</td>
                                    <td className="p-3 border">{item.end_date}</td>
                                    <td className="p-3 border">{item.status}</td>
                                    <td className="p-3 border">
                                        <div className="flex gap-2">
                                            <Link to={`/tenancies/${item.id}`} className="text-blue-600">
                                                View
                                            </Link>
                                            <Link to={`/tenancies/${item.id}/edit`} className="text-green-600">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600">
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
}
