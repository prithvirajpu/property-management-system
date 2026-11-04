
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProperties, deleteProperty } from "../../services/propertyService";

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await getProperties();

            setProperties(response.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load properties."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleDelete = async (propertyId) => {
        if (!window.confirm("Are you sure you want to delete this property?")) {
            return;
        }

        try {
            await deleteProperty(propertyId);
            fetchProperties();
        } catch (err) {
            alert(
                err.response?.data?.message || "Failed to delete property."
            );
        }
    };

    if (loading) return <p>Loading properties...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Properties</h2>
                    <p className="text-gray-500">Manage your properties.</p>
                </div>

                <Link
                    to="/properties/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Add Property
                </Link>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {properties.length === 0 ? (
                <p className="text-gray-500">No properties found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {properties.map((property) => (
                        <div
                            key={property.id}
                            className="bg-white p-5 rounded-xl shadow-sm border"
                        >
                            <h3 className="text-lg font-semibold">
                                {property.name}
                            </h3>

                            <p className="text-gray-500 mt-2">
                                {property.location}
                            </p>

                            <p className="text-gray-600 mt-2 text-sm">
                                {property.address}
                            </p>

                            <div className="flex gap-3 mt-5">
                                <Link
                                    to={`/properties/${property.id}`}
                                    className="text-blue-600 font-medium"
                                >
                                    View
                                </Link>
                                <Link
                                        to={`/properties/${property.id}/edit`}
                                        className="text-green-600"
                                    >
                                        Edit
                                    </Link>

                                <button
                                    onClick={() => handleDelete(property.id)}
                                    className="text-red-600 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropertyList;
