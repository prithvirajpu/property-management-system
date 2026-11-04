
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getProperty,
    updateProperty,
    patchProperty,
} from "../../services/propertyService";

const initialForm = {
    name: "",
    address: "",
    location: "",
    description: "",
    features: "",
};

const fields = ["name", "address", "location", "description", "features"];

export default function PropertyEdit() {
    const { propertyId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProperty = async () => {
            try {
                const response = await getProperty(propertyId);
                const property = response.data;

                const initial = {
                    name: property.name || "",
                    address: property.address || "",
                    location: property.location || "",
                    description: property.description || "",
                    features: Array.isArray(property.features)
                        ? property.features.join(", ")
                        : "",
                };

                setFormData(initial);
                setOriginalData(initial);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load property."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProperty();
    }, [propertyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const preparePayload = () => ({
        ...formData,
        features: formData.features
            .split(",")
            .map((feature) => feature.trim())
            .filter(Boolean),
    });

    const handlePatch = async () => {
        const payload = preparePayload();
        const originalPayload = {
            ...originalData,
            features: originalData.features
                .split(",")
                .map((feature) => feature.trim())
                .filter(Boolean),
        };

        const changedData = {};

        fields.forEach((field) => {
            if (
                JSON.stringify(payload[field]) !==
                JSON.stringify(originalPayload[field])
            ) {
                changedData[field] = payload[field];
            }
        });

        if (Object.keys(changedData).length === 0) {
            alert("No changes detected.");
            return;
        }

        await patchProperty(propertyId, changedData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await handlePatch();
            navigate(`/properties/${propertyId}`);
        } catch (err) {
            setError(
                JSON.stringify(
                    err.response?.data?.errors || err.response?.data
                ) || "Failed to update property."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handlePut = async () => {
        setError("");
        setSubmitting(true);

        try {
            await updateProperty(propertyId, preparePayload());
            navigate(`/properties/${propertyId}`);
        } catch (err) {
            setError(
                JSON.stringify(
                    err.response?.data?.errors || err.response?.data
                ) || "Failed to update property."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="p-6">Loading property...</p>;

    if (!originalData) {
        return <p className="p-6 text-red-600">{error || "Property not found."}</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Property</h1>

            {error && (
                <p className="text-red-600 mb-4">{error}</p>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow space-y-4"
            >
                <div>
                    <label className="block mb-1">Property Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        Features (comma separated)
                    </label>
                    <textarea
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                        placeholder="Parking, Swimming Pool, Security"
                        rows="3"
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Save Changes (PATCH)"}
                    </button>

                    <button
                        type="button"
                        onClick={handlePut}
                        disabled={submitting}
                        className="bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50"
                    >
                        Save Full Update (PUT)
                    </button>

                    <Link
                        to={`/properties/${propertyId}`}
                        className="border px-5 py-2 rounded"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
