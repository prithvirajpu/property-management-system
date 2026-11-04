import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getTenancy,
    updateTenancy,
    patchTenancy,
} from "../../services/tenancyService";
import { getTenants } from "../../services/tenantService";
import { getUnits } from "../../services/unitService";
import { validateTenancy } from "../../validations/tenancyValidation";
import { notifyError, notifySuccess } from "../../utils/toast";

const fields = [
    "tenant",
    "unit",
    "start_date",
    "end_date",
    "monthly_rent",
    "rent_due_day",
    "status",
];

export default function TenancyEdit() {
    const { tenancyId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [tenants, setTenants] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const [tenancyResponse, tenantResponse, unitResponse] =
                    await Promise.all([
                        getTenancy(tenancyId),
                        getTenants(),
                        getUnits(),
                    ]);

                const tenancy = tenancyResponse.data;

                const initial = {
                    tenant: String(tenancy.tenant),
                    unit: String(tenancy.unit),
                    start_date: tenancy.start_date,
                    end_date: tenancy.end_date,
                    monthly_rent: String(tenancy.monthly_rent),
                    rent_due_day: String(tenancy.rent_due_day),
                    status: tenancy.status,
                };

                setFormData(initial);
                setOriginalData(initial);
                setTenants(tenantResponse.data || []);
                setUnits(unitResponse.data || []);
            } catch (err) {
                notifyError(
                    err.response?.data?.message ||
                    "Failed to load tenancy."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [tenancyId]);

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

    const getPayload = () => ({
        ...formData,
        tenant: Number(formData.tenant),
        unit: Number(formData.unit),
        monthly_rent: Number(formData.monthly_rent),
        rent_due_day: Number(formData.rent_due_day),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validationErrors = validateTenancy(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const payload = getPayload();

        const original = {
            ...originalData,
            tenant: Number(originalData.tenant),
            unit: Number(originalData.unit),
            monthly_rent: Number(originalData.monthly_rent),
            rent_due_day: Number(originalData.rent_due_day),
        };

        const changedData = {};

        fields.forEach((field) => {
            if (payload[field] !== original[field]) {
                changedData[field] = payload[field];
            }
        });

        if (Object.keys(changedData).length === 0) {
            setError("No changes detected.");
            return;
        }

        setSubmitting(true);

        try {
            await patchTenancy(tenancyId, changedData);
            navigate(`/tenancies/${tenancyId}`);
            notifySuccess("Successfully updated");
        } catch (err) {
            notifyError(
                JSON.stringify(
                    err.response?.data?.errors || err.response?.data
                ) || "Failed to update tenancy."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleFullUpdate = async () => {
        setError("");

        const validationErrors = validateTenancy(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await updateTenancy(tenancyId, getPayload());
            navigate(`/tenancies/${tenancyId}`);
            notifySuccess("Successfully updated");
        } catch (err) {
            notifyError(
                JSON.stringify(
                    err.response?.data?.errors || err.response?.data
                ) || "Failed to update tenancy."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-[#815854] font-medium text-sm animate-pulse">
                    Loading tenancy...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Edit Tenancy
                </h2>
                <Link
                    to={`/tenancies/${tenancyId}`}
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
                {/* Row 1: Tenant & Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Tenant
                        </label>
                        <select
                            name="tenant"
                            value={formData.tenant || ""}
                            onChange={handleChange}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm font-medium"
                        >
                            <option value="">Select Tenant</option>
                            {tenants.map((tenant) => (
                                <option key={tenant.id} value={tenant.id}>
                                    {tenant.full_name} ({tenant.email})
                                </option>
                            ))}
                        </select>
                        {errors.tenant && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.tenant}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Unit
                        </label>
                        <select
                            name="unit"
                            value={formData.unit || ""}
                            onChange={handleChange}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm font-medium"
                        >
                            <option value="">Select Unit</option>
                            {units.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    Unit {unit.unit_number} - {unit.property_name}
                                </option>
                            ))}
                        </select>
                        {errors.unit && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.unit}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: Monthly Rent & Rent Due Day */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Monthly Rent
                        </label>
                        <input
                            type="number"
                            name="monthly_rent"
                            value={formData.monthly_rent || ""}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.monthly_rent && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.monthly_rent}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Rent Due Day
                        </label>
                        <input
                            type="number"
                            name="rent_due_day"
                            value={formData.rent_due_day || ""}
                            onChange={handleChange}
                            min="1"
                            max="31"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.rent_due_day && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.rent_due_day}</p>
                        )}
                    </div>
                </div>

                {/* Row 3: Start Date & End Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date || ""}
                            onChange={handleChange}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.start_date && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.start_date}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date || ""}
                            onChange={handleChange}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.end_date && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.end_date}</p>
                        )}
                    </div>
                </div>

                {/* Row 4: Status */}
                <div>
                    <label className="block mb-1 text-xs font-semibold text-[#815854]">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status || "ACTIVE"}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm font-medium"
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="TERMINATED">Terminated</option>
                    </select>
                    {errors.status && (
                        <p className="text-rose-600 text-[11px] mt-0.5">{errors.status}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#815854]/15">
                    <Link
                        to={`/tenancies/${tenancyId}`}
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 font-semibold px-4 py-2 rounded-md text-xs transition-colors shadow-xs"
                    >
                        Cancel
                    </Link>

                    <button
                        type="button"
                        onClick={handleFullUpdate}
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