
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUnit } from "../../services/unitService";

const UnitDetail = () => {
    const { unitId } = useParams();

    const [unit, setUnit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const response = await getUnit(unitId);
                setUnit(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load unit.");
            } finally {
                setLoading(false);
            }
        };

        fetchUnit();
    }, [unitId]);

    if (loading) return <p>Loading unit...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!unit) return <p>Unit not found.</p>;

    return (
        <div>
            <Link to="/units" className="text-blue-600">
                ← Back to Units
            </Link>

            <div className="bg-white p-6 rounded-xl shadow-sm mt-5">
                <h2 className="text-2xl font-bold mb-5">
                    Unit {unit.unit_number}
                </h2>

                <div className="space-y-3">
                    <p><strong>Property:</strong> {unit.property_name || unit.property}</p>
                    <p><strong>Unit Type:</strong> {unit.unit_type}</p>
                    <p><strong>Monthly Rent:</strong> ₹{unit.monthly_rent}</p>
                    <p><strong>Area:</strong> {unit.area ?? "N/A"}</p>
                    <p><strong>Floor:</strong> {unit.floor ?? "N/A"}</p>
                    <p><strong>Description:</strong> {unit.description || "N/A"}</p>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-3">Features</h3>

                    <div className="flex flex-wrap gap-2">
                        {unit.features?.length ? (
                            unit.features.map((feature) => (
                                <span
                                    key={feature}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                                >
                                    {feature}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">No features added.</p>
                        )}
                    </div>
                </div>

                <Link
                    to={`/units/${unit.id}/edit`}
                    className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    Edit Unit
                </Link>
            </div>
        </div>
    );
};

export default UnitDetail;
