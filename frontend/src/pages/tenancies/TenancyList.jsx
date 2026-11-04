
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTenancies, deleteTenancy } from "../../services/tenancyService";
import { getTenants } from "../../services/tenantService";
import { getProperties } from "../../services/propertyService";
import { getUnits } from "../../services/unitService";

const initialFilters = {
    search: "",
    tenant: "",
    property: "",
    unit: "",
    status: "",
    ordering: "",
};

export default function TenancyList() {
    const [tenancies, setTenancies] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [properties, setProperties] = useState([]);
    const [units, setUnits] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [tenantResponse, propertyResponse, unitResponse] =
                    await Promise.all([
                        getTenants(),
                        getProperties(),
                        getUnits(),
                    ]);

                setTenants(tenantResponse.data || []);
                setProperties(propertyResponse.data || []);
                setUnits(unitResponse.data || []);
            } catch {
                setError("Failed to load filter options.");
            }
        };

        loadOptions();
    }, []);

    useEffect(() => {
        const loadTenancies = async () => {
            try {
                setLoading(true);
                setError("");

                const params = Object.fromEntries(
                    Object.entries(filters).filter(([, value]) => value !== "")
                );

                const response = await getTenancies(params);
                setTenancies(response.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load tenancies.");
            } finally {
                setLoading(false);
            }
        };

        loadTenancies();
    }, [filters]);

    const handleChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            ...(e.target.name === "property" ? { unit: "" } : {}),
        }));
    };

    const clearFilters = () => setFilters(initialFilters);

    const filteredUnits = filters.property
        ? units.filter((unit) => String(unit.property) === filters.property)
        : units;

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tenancy?")) return;

        try {
            await deleteTenancy(id);
            setTenancies((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete tenancy.");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Tenancies</h1>
                    <p className="text-gray-500">Manage rental agreements.</p>
                </div>

                <Link to="/tenancies/create" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Tenancy
                </Link>
            </div>

            <div className="bg-white border rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search tenancies..."
                    className="border rounded-lg p-2"
                />

                <select name="tenant" value={filters.tenant} onChange={handleChange} className="border rounded-lg p-2">
                    <option value="">All Tenants</option>
                    {tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                            {tenant.full_name}
                        </option>
                    ))}
                </select>

                <select name="property" value={filters.property} onChange={handleChange} className="border rounded-lg p-2">
                    <option value="">All Properties</option>
                    {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                            {property.name}
                        </option>
                    ))}
                </select>

                <select name="unit" value={filters.unit} onChange={handleChange} className="border rounded-lg p-2">
                    <option value="">All Units</option>
                    {filteredUnits.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                            {unit.unit_number}
                        </option>
                    ))}
                </select>

                <select name="status" value={filters.status} onChange={handleChange} className="border rounded-lg p-2">
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="TERMINATED">Terminated</option>
                </select>

                <select name="ordering" value={filters.ordering} onChange={handleChange} className="border rounded-lg p-2">
                    <option value="">Default ordering</option>
                    <option value="start_date">Start date: Oldest first</option>
                    <option value="-start_date">Start date: Newest first</option>
                    <option value="monthly_rent">Rent: Low to High</option>
                    <option value="-monthly_rent">Rent: High to Low</option>
                </select>

                <button onClick={clearFilters} className="border rounded-lg p-2 hover:bg-gray-50">
                    Clear Filters
                </button>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {loading ? (
                <p>Loading tenancies...</p>
            ) : tenancies.length === 0 ? (
                <p className="text-gray-500">No matching tenancies found.</p>
            ) : (
                <>
                    <p className="text-sm text-gray-500 mb-3">
                        {tenancies.length} tenancies found
                    </p>

                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-100">
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
                                    <tr key={item.id} className="border-t">
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
                </>
            )}
        </div>
    )}

