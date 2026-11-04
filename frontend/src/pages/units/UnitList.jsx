
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUnits, deleteUnit } from "../../services/unitService";
import { getProperties } from "../../services/propertyService";

const initialFilters = {
    search: "",
    property: "",
    unit_type: "",
    floor: "",
    min_rent: "",
    max_rent: "",
    ordering: "",
};

const UnitList = () => {
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProperties = async () => {
            try {
                const response = await getProperties();
                setProperties(response.data || []);
            } catch {
                setError("Failed to load properties for filtering.");
            }
        };

        loadProperties();
    }, []);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                setLoading(true);
                setError("");

                const params = Object.fromEntries(
                    Object.entries(filters).filter(([, value]) => value !== "")
                );

                const response = await getUnits(params);
                setUnits(response.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load units.");
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, [filters]);

    const handleChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const clearFilters = () => setFilters(initialFilters);

    const handleDelete = async (unitId) => {
        if (!window.confirm("Are you sure you want to delete this unit?")) return;

        try {
            await deleteUnit(unitId);
            setUnits((prev) => prev.filter((unit) => unit.id !== unitId));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete unit.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Units</h2>
                    <p className="text-gray-500">Manage property units.</p>
                </div>

                <Link to="/units/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Add Unit
                </Link>
            </div>

            <div className="bg-white border rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search unit number or property..."
                    className="border rounded-lg p-2"
                />

                <select name="property" value={filters.property} onChange={handleChange} className="border rounded-lg p-2">
                    <option value="">All Properties</option>
                    {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                            {property.name}
                        </option>
                    ))}
                </select>

                <select name="unit_type" value={filters.unit_type} onChange={handleChange} className="border rounded-lg p-2">
                    <option value="">All Unit Types</option>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                </select>

                <input
                    type="number"
                    name="floor"
                    value={filters.floor}
                    onChange={handleChange}
                    placeholder="Floor number"
                    className="border rounded-lg p-2"
                />

                <input
                    type="number"
                    name="min_rent"
                    value={filters.min_rent}
                    onChange={handleChange}
                    placeholder="Minimum rent"
                    min="0"
                    className="border rounded-lg p-2"
                />

                <input
                    type="number"
                    name="max_rent"
                    value={filters.max_rent}
                    onChange={handleChange}
                    placeholder="Maximum rent"
                    min="0"
                    className="border rounded-lg p-2"
                />

                <select name="ordering" value={filters.ordering} onChange={handleChange} className="border rounded-lg p-2">
                    <option value="">Default ordering</option>
                    <option value="monthly_rent">Rent: Low to High</option>
                    <option value="-monthly_rent">Rent: High to Low</option>
                    <option value="unit_number">Unit: A to Z</option>
                    <option value="-unit_number">Unit: Z to A</option>
                    <option value="floor">Floor: Low to High</option>
                    <option value="-floor">Floor: High to Low</option>
                    <option value="-created_at">Newest first</option>
                    <option value="created_at">Oldest first</option>
                </select>

                <button onClick={clearFilters} className="border rounded-lg p-2 hover:bg-gray-50">
                    Clear Filters
                </button>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {loading ? (
                <p>Loading units...</p>
            ) : units.length === 0 ? (
                <p className="text-gray-500">No units found.</p>
            ) : (
                <>
                    <p className="text-sm text-gray-500 mb-3">
                        {units.length} units found
                    </p>

                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4">Unit Number</th>
                                    <th className="p-4">Property</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Monthly Rent</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {units.map((unit) => (
                                    <tr key={unit.id} className="border-t">
                                        <td className="p-4">{unit.unit_number}</td>
                                        <td className="p-4">{unit.property_name || unit.property}</td>
                                        <td className="p-4">{unit.unit_type}</td>
                                        <td className="p-4">₹{unit.monthly_rent}</td>
                                        <td className="p-4">
                                            <div className="flex gap-3">
                                                <Link to={`/units/${unit.id}`} className="text-blue-600">
                                                    View
                                                </Link>
                                                <Link to={`/units/${unit.id}/edit`} className="text-green-600">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(unit.id)} className="text-red-600">
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

export default UnitList;
