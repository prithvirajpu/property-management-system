
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUnits, deleteUnit } from "../../services/unitService";

const UnitList = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUnits = async () => {
        try {
            setLoading(true);
            const response = await getUnits();
            setUnits(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load units.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const handleDelete = async (unitId) => {
        if (!window.confirm("Are you sure you want to delete this unit?")) {
            return;
        }

        try {
            await deleteUnit(unitId);
            fetchUnits();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete unit.");
        }
    };

    if (loading) return <p>Loading units...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Units</h2>
                    <p className="text-gray-500">Manage property units.</p>
                </div>

                <Link
                    to="/units/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Add Unit
                </Link>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {units.length === 0 ? (
                <p className="text-gray-500">No units found.</p>
            ) : (
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
                                    <td className="p-4">
                                        {unit.property_name || unit.property}
                                    </td>
                                    <td className="p-4">{unit.unit_type}</td>
                                    <td className="p-4">₹{unit.monthly_rent}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/units/${unit.id}`}
                                                className="text-blue-600"
                                            >
                                                View
                                            </Link>

                                            <Link
                                                to={`/units/${unit.id}/edit`}
                                                className="text-green-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(unit.id)}
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

export default UnitList;
