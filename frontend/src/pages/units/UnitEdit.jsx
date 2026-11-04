import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUnit, updateUnit, patchUnit } from "../../services/unitService";
import { getProperties } from "../../services/propertyService";
import { validateUnit } from "../../validations/unitValidation";
import { notifySuccess, notifyError } from "../../utils/toast";

const UnitEdit = () => {
    const { unitId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [originalData, setOriginalData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [unitResponse, propertyResponse] = await Promise.all([
                    getUnit(unitId),
                    getProperties(),
                ]);

                setProperties(propertyResponse.data || []);

                const unitData = unitResponse.data;

                setFormData(unitData);
                setOriginalData(unitData);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load unit.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [unitId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e, partial = false) => {
        e.preventDefault();
        setError("");

        const validationErrors = validateUnit(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setSaving(true);

        try {
            const payload = {
                ...formData,
                property: Number(formData.property),
                monthly_rent: Number(formData.monthly_rent),
                area: formData.area === "" ? null : Number(formData.area),
                floor: formData.floor === "" ? null : Number(formData.floor),
            };

            if (partial) {
                const changedFields = {};

                Object.keys(payload).forEach((key) => {
                    if (
                        JSON.stringify(payload[key]) !==
                        JSON.stringify(originalData[key])
                    ) {
                        changedFields[key] = payload[key];
                    }
                });

                if (Object.keys(changedFields).length === 0) {
                    setError("No changes detected.");
                    return;
                }

                await patchUnit(unitId, changedFields);
            } else {
                await updateUnit(unitId, payload);
            }

            navigate(`/units/${unitId}`);
            notifySuccess("Successfully updated");
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                JSON.stringify(err.response?.data?.errors || {}) ||
                "Failed to update unit.";
            setError(errorMsg);
            notifyError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-[#815854] font-medium text-sm animate-pulse">
                    Loading unit...
                </p>
            </div>
        );
    }

    if (!formData) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-0 py-6">
                <p className="text-rose-600 font-medium text-sm">
                    {error || "Unit not found."}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Edit Unit
                </h2>
                <Link
                    to={`/units/${unitId}`}
                    className="text-xs font-semibold text-[#815854]/70 hover:text-[#815854] underline"
                >
                    &larr; Cancel / Back
                </Link>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 rounded-r-lg text-xs font-medium flex items-center gap-2 shadow-sm">
                    <span>{error}</span>
                </div>
            )}

            {/* Form Container */}
            <form
                onSubmit={(e) => handleSubmit(e, false)}
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
                            value={formData.unit_number || ""}
                            onChange={handleChange}
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
                            value={formData.area ?? ""}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
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
                            value={formData.floor ?? ""}
                            onChange={handleChange}
                            min="0"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.floor && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.floor}</p>
                        )}
                    </div>
                </div>

                {/* Row 4: Description */}
                <div>
                    <label className="block mb-1 text-xs font-semibold text-[#815854]">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        rows="2"
                        className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm resize-none"
                    />
                    {errors.description && (
                        <p className="text-rose-600 text-[11px] mt-0.5">{errors.description}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#815854]/15">
                    <Link
                        to={`/units/${unitId}`}
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 font-semibold px-4 py-2 rounded-md text-xs transition-colors shadow-xs"
                    >
                        Cancel
                    </Link>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={(e) => handleSubmit(e, true)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-md text-xs shadow-sm disabled:opacity-50 transition-all"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-4 py-2 rounded-md text-xs shadow-sm disabled:opacity-50 transition-all"
                    >
                        {saving ? "Saving..." : "Save All Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UnitEdit;