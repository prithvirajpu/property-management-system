
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProperty } from "../../services/propertyService";

const PropertyDetail = () => {
    const { propertyId } = useParams();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await getProperty(propertyId);
                setProperty(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to load property."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [propertyId]);

    if (loading) return <p>Loading property...</p>;

    if (error) return <p className="text-red-600">{error}</p>;

    if (!property) return <p>Property not found.</p>;

    return (
        <div>
            <Link to="/properties" className="text-blue-600">
                ← Back to Properties
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-6 mt-5">
                <h2 className="text-2xl font-bold">{property.name}</h2>

                <div className="mt-5 space-y-3">
                    <p><strong>Address:</strong> {property.address}</p>
                    <p><strong>Location:</strong> {property.location}</p>
                    <p><strong>Description:</strong> {property.description || "N/A"}</p>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-3">Features</h3>

                    <div className="flex flex-wrap gap-2">
                        {property.features?.length ? (
                            property.features.map((feature) => (
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

                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3">Units</h3>

                    {property.units?.length ? (
                        <div className="space-y-3">
                            {property.units.map((unit) => (
                                <div
                                    key={unit.id}
                                    className="border rounded-lg p-4"
                                >
                                    <p><strong>Unit:</strong> {unit.unit_number}</p>
                                    <p><strong>Type:</strong> {unit.unit_type}</p>
                                    <p><strong>Monthly Rent:</strong> ₹{unit.monthly_rent}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No units added to this property yet.
                        </p>
                    )}
                </div>
                <div className="py-4">
                    <Link
    to={`/properties/${propertyId}/edit`}
    className="bg-blue-600 text-white px-4 py-2 rounded"
>
    Edit Property
</Link>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
