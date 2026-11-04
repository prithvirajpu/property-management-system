import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTenant } from "../../services/tenantService";
import { validateTenant } from "../../validations/tenantValidation";
import { notifyError, notifySuccess } from "../../utils/toast";

const TenantCreate = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validationErrors = validateTenant(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            const response = await createTenant(formData);
            const tenant = response.data;

            navigate(`/tenants/${tenant.id}/documents`);
            notifySuccess("Successfully created");
        } catch (err) {
            const errorData = err.response?.data;
            const errorMessage = 
                errorData?.email?.[0] || 
                (errorData && Object.values(errorData)[0]?.[0]) || 
                "Failed to create tenant.";

            notifyError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Add Tenant
                </h2>
                <Link
                    to="/tenants"
                    className="text-xs font-semibold text-[#815854]/70 hover:text-[#815854] underline"
                >
                    &larr; Back to Tenants
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
                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Full Name
                        </label>
                        <input
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.full_name && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.full_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. john@example.com"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.email && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: Phone */}
                <div>
                    <label className="block mb-1 text-xs font-semibold text-[#815854]">
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210"
                        className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                    />
                    {errors.phone && (
                        <p className="text-rose-600 text-[11px] mt-0.5">{errors.phone}</p>
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
                        placeholder="Enter full address..."
                        className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm resize-none"
                    />
                    {errors.address && (
                        <p className="text-rose-600 text-[11px] mt-0.5">{errors.address}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#815854]/15">
                    <Link
                        to="/tenants"
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 font-semibold px-4 py-2 rounded-md text-xs transition-colors shadow-xs"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-5 py-2 rounded-md shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all text-xs"
                    >
                        {loading ? "Saving..." : "Create Tenant"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TenantCreate;