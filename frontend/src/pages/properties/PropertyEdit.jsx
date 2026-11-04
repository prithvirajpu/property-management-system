import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getProperty,
    updateProperty,
    patchProperty,
} from "../../services/propertyService";
import { validateProperty } from "../../validations/PropertyValidation";
import {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
} from "../../utils/toast";
import { handleApiError } from "../../utils/errorHandler";

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
    const [errors, setErrors] = useState({});

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

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const preparePayload = () => ({
        ...formData,
        name: formData.name.trim(),
        address: formData.address.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        features: formData.features
            .split(",")
            .map((feature) => feature.trim())
            .filter(Boolean),
    });

    // Validate before PATCH or PUT
    const validateForm = () => {
        const validationErrors = validateProperty({
            ...formData,
            features: formData.features
                .split(",")
                .map((feature) => feature.trim())
                .filter(Boolean),
        });

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

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
            notifyInfo("No changes detected.");
            return;
        }

        await patchProperty(propertyId, changedData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }
        setSubmitting(true);

        try {
            await handlePatch();
            navigate(`/properties/${propertyId}`);
            notifySuccess("Successfully submitted.");
        } catch (err) {
            handleApiError(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePut = async () => {
        setError("");

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            await updateProperty(propertyId, preparePayload());
            navigate(`/properties/${propertyId}`);
            notifySuccess("Successfully submitted.");
        } catch (err) {
            notifyError(
                JSON.stringify(
                    err.response?.data?.errors || err.response?.data
                ) || "Failed to update property."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-[#815854] font-medium text-sm animate-pulse">
                    Loading property...
                </p>
            </div>
        );
    }

    if (!originalData) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-0 py-6">
                <p className="text-rose-600 font-medium text-sm">
                    {error || "Property not found."}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Edit Property
                </h2>
                <Link
                    to={`/properties/${propertyId}`}
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
                            type="text"
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
                            type="text"
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
                            rows="2"
                            placeholder="Full address..."
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm resize-none"
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
                            rows="2"
                            placeholder="Brief description..."
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm resize-none"
                        />
                    </div>
                </div>

                {/* Row 3: Features */}
                <div>
                    <label className="block mb-1 text-xs font-semibold text-[#815854]">
                        Features (comma separated)
                    </label>
                    <textarea
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                        placeholder="Parking, Swimming Pool, Security"
                        rows="2"
                        className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm resize-none"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#815854]/15">
                    <Link
                        to={`/properties/${propertyId}`}
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 font-semibold px-4 py-2 rounded-md text-xs transition-colors shadow-xs"
                    >
                        Cancel
                    </Link>

                    <button
                        type="button"
                        onClick={handlePut}
                        disabled={submitting}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-md text-xs shadow-sm disabled:opacity-50 transition-all"
                    >
                        {submitting ? "Saving..." : "Save Full Update"}
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-4 py-2 rounded-md text-xs shadow-sm disabled:opacity-50 transition-all"
                    >
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}