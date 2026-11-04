import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../services/propertyService";
import { validateProperty } from "../../validations/PropertyValidation";
import { handleApiError } from "../../utils/errorHandler";

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
    const [errors, setErrors] = useState({});

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

        // Validate form data
        const validationErrors = validateProperty(formData);
        setErrors(validationErrors);

        // Stop submission if errors exist
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            await createProperty(formData);
            navigate("/properties");
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8">
            {/* Page Header */}
            <div className="mb-4 flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Add Property
                </h2>
                <button
                    type="button"
                    onClick={() => navigate("/properties")}
                    className="text-xs font-semibold text-[#815854]/70 hover:text-[#815854] underline"
                >
                    &larr; Back to Properties
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 rounded-r-lg text-xs font-medium flex items-center gap-2 shadow-sm">
                    <span>{error}</span>
                </div>
            )}

            {/* Compact Form Container */}
            <form
                onSubmit={handleSubmit}
                className="bg-[#F9EBDE] border border-[#815854]/20 p-5 sm:p-6 rounded-xl shadow-sm space-y-4"
            >
                {/* Row 1: Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Property Name
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Sunset Heights"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.name && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Location
                        </label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Downtown / Kochi"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.location && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.location}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: Address & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Full address..."
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm resize-none"
                            rows="2"
                        />
                        {errors.address && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.address}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description..."
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm resize-none"
                            rows="2"
                        />
                    </div>
                </div>

                {/* Row 3: Features */}
                <div>
                    <label className="block mb-1 text-xs font-semibold text-[#815854]">
                        Features & Amenities
                    </label>

                    <div className="flex gap-2">
                        <input
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            placeholder="e.g. Swimming Pool"
                            className="flex-1 bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />

                        <button
                            type="button"
                            onClick={addFeature}
                            className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-medium px-4 py-2 rounded-md text-xs transition-colors shadow-sm"
                        >
                            Add
                        </button>
                    </div>

                    {/* Features Badges */}
                    {formData.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.features.map((feature) => (
                                <span
                                    key={feature}
                                    className="bg-white border border-[#815854]/20 text-[#815854] px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-xs"
                                >
                                    <span>{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(feature)}
                                        className="text-[#815854]/60 hover:text-rose-600 font-bold leading-none"
                                        aria-label={`Remove ${feature}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#815854]/15">
                    <button
                        type="button"
                        onClick={() => navigate("/properties")}
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 font-semibold px-4 py-2 rounded-md text-xs transition-colors shadow-xs"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-5 py-2 rounded-md shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all text-xs"
                    >
                        {loading ? "Saving..." : "Create Property"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PropertyCreate;