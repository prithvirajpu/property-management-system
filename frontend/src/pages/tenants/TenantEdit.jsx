import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getTenant,
    updateTenant,
    patchTenant,
} from "../../services/tenantService";
import { validateTenant } from "../../validations/tenantValidation";
import { notifyError, notifySuccess } from "../../utils/toast";

const TenantEdit = () => {
    const { tenantId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const response = await getTenant(tenantId);
                const tenant = response.data;

                const initialData = {
                    full_name: tenant.full_name,
                    email: tenant.email,
                    phone: tenant.phone,
                    address: tenant.address,
                };

                setFormData(initialData);
                setOriginalData(initialData);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load tenant.");
            } finally {
                setLoading(false);
            }
        };

        fetchTenant();
    }, [tenantId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e, partial = false) => {
        e.preventDefault();
        setError("");

        const validationErrors = validateTenant(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setSaving(true);

        try {
            if (partial) {
                const changedFields = {};

                Object.keys(formData).forEach((key) => {
                    if (formData[key] !== originalData[key]) {
                        changedFields[key] = formData[key];
                    }
                });

                if (Object.keys(changedFields).length === 0) {
                    setError("No changes detected.");
                    return;
                }

                await patchTenant(tenantId, changedFields);
            } else {
                await updateTenant(tenantId, formData);
            }

            navigate(`/tenants/${tenantId}`);
            notifySuccess("Successfully updated");
        } catch (err) {
            const errorData = err.response?.data;
            const errorMessage = 
                errorData?.email?.[0] || 
                (errorData && Object.values(errorData)[0]?.[0]) || 
                "Failed to update tenant.";

            notifyError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-[#815854] font-medium text-sm animate-pulse">
                    Loading tenant...
                </p>
            </div>
        );
    }

    if (!formData) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-0 py-6">
                <p className="text-rose-600 font-medium text-sm">
                    {error || "Tenant not found."}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Edit Tenant
                </h2>
                <Link
                    to={`/tenants/${tenantId}`}
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
                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { name: "full_name", label: "Full Name" },
                        { name: "email", label: "Email", type: "email" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block mb-1 text-xs font-semibold text-[#815854]">
                                {field.label}
                            </label>
                            <input
                                type={field.type || "text"}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                            />
                            {errors[field.name] && (
                                <p className="text-rose-600 text-[11px] mt-0.5">
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Row 2: Phone */}
                <div>
                    <label className="block mb-1 text-xs font-semibold text-[#815854]">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                    />
                    {errors.phone && (
                        <p className="text-rose-600 text-[11px] mt-0.5">
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* Row 3: Address */}
                <div>
                    <label className="block mb-1 text-xs font-semibold text-[#815854]">
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm resize-none"
                    />
                    {errors.address && (
                        <p className="text-rose-600 text-[11px] mt-0.5">
                            {errors.address}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#815854]/15">
                    <Link
                        to={`/tenants/${tenantId}`}
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
                        {saving ? "Saving..." : "Save Changed Fields"}
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

export default TenantEdit;