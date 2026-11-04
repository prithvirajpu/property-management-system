
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../services/propertyService";

const PropertyCreate = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        location: "",
        description: "",
        features: [],
    });

    const [featureInput, setFeatureInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const addFeature = () => {
        const feature = featureInput.trim();

        if (feature && !formData.features.includes(feature)) {
            setFormData({
                ...formData,
                features: [...formData.features, feature],
            });
        }

        setFeatureInput("");
    };

    const removeFeature = (feature) => {
        setFormData({
            ...formData,
            features: formData.features.filter((item) => item !== feature),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await createProperty(formData);
            navigate("/properties");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                JSON.stringify(err.response?.data?.errors || {}) ||
                "Failed to create property."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Add Property</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-sm space-y-5"
            >
                <div>
                    <label className="block mb-2 font-medium">
                        Property Name
                    </label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                        rows="3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Location</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        rows="3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Features</label>

                    <div className="flex gap-2">
                        <input
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            placeholder="e.g. Swimming Pool"
                            className="flex-1 border rounded-lg p-3"
                        />

                        <button
                            type="button"
                            onClick={addFeature}
                            className="bg-gray-800 text-white px-4 rounded-lg"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {formData.features.map((feature) => (
                            <span
                                key={feature}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                            >
                                {feature}
                                <button
                                    type="button"
                                    onClick={() => removeFeature(feature)}
                                    className="ml-2"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                        {loading ? "Saving..." : "Create Property"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/properties")}
                        className="bg-gray-200 px-6 py-3 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PropertyCreate;
