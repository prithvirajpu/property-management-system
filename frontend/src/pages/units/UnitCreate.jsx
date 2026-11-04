import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUnit } from "../../services/unitService";
import { getProperties } from "../../services/propertyService";
import { validateUnit } from "../../validations/unitValidation";
import { notifyError, notifySuccess } from "../../utils/toast";
import { handleApiError } from "../../utils/errorHandler";

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
    const [errors, setErrors] = useState({});

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

        setErrors((prev) => ({
            ...prev,
            [e.target.name]: "",
        }));
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
        setErrors((prev) => ({
            ...prev,
            features: "",
        }));
    };

    const removeFeature = (feature) => {
        setFormData({
            ...formData,
            features: formData.features.filter((item) => item !== feature),
        });

        setErrors((prev) => ({
            ...prev,
            features: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validationErrors = validateUnit(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

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
            notifySuccess("Successfully created");
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8 space-y-4">
            {/* Header & Navigation */}
            <div className="flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Add Unit
                </h2>
                <Link
                    to="/units"
                    className="text-xs font-semibold text-[#815854]/70 hover:text-[#815854] underline transition-colors"
                >
                    &larr; Back to Units
                </Link>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 rounded-r-lg text-xs font-medium shadow-sm">
                    {error}
                </div>
            )}

            {/* Form Container */}
            <form
                onSubmit={handleSubmit}
                className="bg-[#F9EBDE] border border-[#815854]/20 p-5 sm:p-6 rounded-xl shadow-sm space-y-4"
            >
                {/* Row 1: Property & Unit Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Property
                        </label>
                        <select
                            name="property"
                            value={formData.property}
                            onChange={handleChange}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm font-medium"
                        >
                            <option value="">Select Property</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property.name}
                                </option>
                            ))}
                        </select>
                        {errors.property && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.property}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Unit Number
                        </label>
                        <input
                            name="unit_number"
                            value={formData.unit_number}
                            onChange={handleChange}
                            placeholder="e.g. 101"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.unit_number && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.unit_number}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: Unit Type & Monthly Rent */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Unit Type
                        </label>
                        <select
                            name="unit_type"
                            value={formData.unit_type}
                            onChange={handleChange}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm font-medium"
                        >
                            {["1BHK", "2BHK", "3BHK", "4BHK"].map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.unit_type && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.unit_type}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Monthly Rent (₹)
                        </label>
                        <input
                            type="number"
                            name="monthly_rent"
                            value={formData.monthly_rent}
                            onChange={handleChange}
                            min="1"
                            placeholder="e.g. 15000"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.monthly_rent && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.monthly_rent}</p>
                        )}
                    </div>
                </div>

                {/* Row 3: Area & Floor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Area (sq. ft.)
                        </label>
                        <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="e.g. 650"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.area && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.area}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Floor
                        </label>
                        <input
                            type="number"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            min="0"
                            placeholder="e.g. 2"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.floor && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.floor}</p>
                        )}
                    </div>
                </div>

                {/* Row 4: Features Input */}
                <div>
                    <label className="block mb-1 text-xs font-semibold text-[#815854]">
                        Features
                    </label>

                    <div className="flex gap-2">
                        <input
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            placeholder="e.g. Balcony"
                            className="flex-1 bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />

                        <button
                            type="button"
                            onClick={addFeature}
                            className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] px-4 py-2 rounded-md text-xs font-semibold shadow-xs transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    {errors.features && (
                        <p className="text-rose-600 text-[11px] mt-0.5">{errors.features}</p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {formData.features.map((feature) => (
                            <span
                                key={feature}
                                className="inline-flex items-center bg-white border border-[#815854]/20 text-[#815854] px-2.5 py-1 rounded-full text-xs font-medium shadow-2xs"
                            >
                                {feature}
                                <button
                                    type="button"
                                    onClick={() => removeFeature(feature)}
                                    className="ml-1.5 text-rose-600 hover:text-rose-800 font-bold"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Row 5: Description */}
                <div>
                    <label className="block mb-1 text-xs font-semibold text-[#815854]">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Enter unit description..."
                        className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm resize-none"
                    />
                    {errors.description && (
                        <p className="text-rose-600 text-[11px] mt-0.5">{errors.description}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#815854]/15">
                    <Link
                        to="/units"
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 font-semibold px-4 py-2 rounded-md text-xs transition-colors shadow-xs"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={loading || properties.length === 0}
                        className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-5 py-2 rounded-md shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all text-xs"
                    >
                        {loading ? "Saving..." : "Create Unit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UnitCreate;