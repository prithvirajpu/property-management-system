import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTenancy } from "../../services/tenancyService";
import { getTenants } from "../../services/tenantService";
import { getUnits } from "../../services/unitService";
import { validateTenancy } from "../../validations/tenancyValidation";
import { notifyError, notifySuccess } from "../../utils/toast";
import { handleApiError } from "../../utils/errorHandler";

const initialForm = {
    tenant: "",
    unit: "",
    start_date: "",
    end_date: "",
    monthly_rent: "",
    rent_due_day: 1,
};

export default function TenancyCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);
    const [tenants, setTenants] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const [tenantResponse, unitResponse] = await Promise.all([
                    getTenants(),
                    getUnits(),
                ]);

                setTenants(tenantResponse.data || []);
                setUnits(unitResponse.data || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load tenants and units."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

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

    const handleUnitChange = (e) => {
        const unitId = e.target.value;
        const selectedUnit = units.find(
            (unit) => String(unit.id) === unitId
        );

        setFormData((prev) => ({
            ...prev,
            unit: unitId,
            monthly_rent: selectedUnit
                ? String(selectedUnit.monthly_rent)
                : prev.monthly_rent,
        }));

        setErrors((prev) => ({
            ...prev,
            unit: "",
            monthly_rent: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validationErrors = validateTenancy(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await createTenancy({
                ...formData,
                tenant: Number(formData.tenant),
                unit: Number(formData.unit),
                monthly_rent: Number(formData.monthly_rent),
                rent_due_day: Number(formData.rent_due_day),
            });

            navigate("/tenancies");
            notifySuccess("Successfully created.");
        } catch (err) {
            handleApiError(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-[#815854] font-medium text-sm animate-pulse">
                    Loading form...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Create Tenancy
                </h2>
                <Link
                    to="/tenancies"
                    className="text-xs font-semibold text-[#815854]/70 hover:text-[#815854] underline"
                >
                    &larr; Back to Tenancies
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
                            value={formData.tenant}
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
                            value={formData.unit}
                            onChange={handleUnitChange}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm font-medium"
                        >
                            <option value="">Select Unit</option>
                            {units.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    Unit {unit.unit_number} - {unit.property_name} ({unit.unit_type})
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
                            value={formData.monthly_rent}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.monthly_rent && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.monthly_rent}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Monthly Rent Due Day
                        </label>
                        <input
                            type="number"
                            name="rent_due_day"
                            value={formData.rent_due_day}
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
                            value={formData.start_date}
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
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm"
                        />
                        {errors.end_date && (
                            <p className="text-rose-600 text-[11px] mt-0.5">{errors.end_date}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#815854]/15">
                    <Link
                        to="/tenancies"
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 font-semibold px-4 py-2 rounded-md text-xs transition-colors shadow-xs"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-5 py-2 rounded-md shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all text-xs"
                    >
                        {submitting ? "Creating..." : "Create Tenancy"}
                    </button>
                </div>
            </form>
        </div>
    );
}