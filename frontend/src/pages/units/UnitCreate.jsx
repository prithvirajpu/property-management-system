
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUnit } from "../../services/unitService";
import { getProperties } from "../../services/propertyService";

const initialForm = {
    property: "",
    unit_number: "",
    unit_type: "1BHK",
    monthly_rent: "",
    area: "",
    floor: "",
    features: [],
    description: "",
};

const UnitCreate = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);
    const [properties, setProperties] = useState([]);
    const [featureInput, setFeatureInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await getProperties();
                setProperties(response.data || []);
            } catch (err) {
                setError("Failed to load properties.");
            }
        };

        fetchProperties();
    }, []);

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
            await createUnit({
                ...formData,
                property: Number(formData.property),
                monthly_rent: Number(formData.monthly_rent),
                area: formData.area ? Number(formData.area) : null,
                floor: formData.floor ? Number(formData.floor) : null,
            });

            navigate("/units");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                JSON.stringify(err.response?.data?.errors || {}) ||
                "Failed to create unit."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Add Unit</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-sm space-y-5"
            >
                <div>
                    <label className="block mb-2 font-medium">Property</label>
                    <select
                        name="property"
                        value={formData.property}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="">Select Property</option>

                        {properties.map((property) => (
                            <option key={property.id} value={property.id}>
                                {property.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Unit Number</label>
                    <input
                        name="unit_number"
                        value={formData.unit_number}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Unit Type</label>
                    <select
                        name="unit_type"
                        value={formData.unit_type}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    >
                        {["1BHK", "2BHK", "3BHK", "4BHK"].map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Monthly Rent</label>
                    <input
                        type="number"
                        name="monthly_rent"
                        value={formData.monthly_rent}
                        onChange={handleChange}
                        min="1"
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Area</label>
                    <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Floor</label>
                    <input
                        type="number"
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        min="0"
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Features</label>

                    <div className="flex gap-2">
                        <input
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            placeholder="e.g. Balcony"
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

                <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || properties.length === 0}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Create Unit"}
                </button>
            </form>
        </div>
    );
};

export default UnitCreate;
