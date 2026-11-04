
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTenancy } from "../../services/tenancyService";
import { getTenants } from "../../services/tenantService";
import { getUnits } from "../../services/unitService";

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
                setError(err.response?.data?.message || "Failed to load tenants and units.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUnitChange = (e) => {
        const unitId = e.target.value;
        const selectedUnit = units.find((unit) => String(unit.id) === unitId);

        setFormData((prev) => ({
            ...prev,
            unit: unitId,
            monthly_rent: selectedUnit?.monthly_rent || prev.monthly_rent,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
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
        } catch (err) {
            setError(
                JSON.stringify(err.response?.data?.errors || err.response?.data) ||
                "Failed to create tenancy."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="p-6">Loading form...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create Tenancy</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block mb-1">Tenant</label>
                    <select name="tenant" value={formData.tenant} onChange={handleChange} required className="w-full border p-2 rounded">
                        <option value="">Select Tenant</option>
                        {tenants.map((tenant) => (
                            <option key={tenant.id} value={tenant.id}>
                                {tenant.full_name} ({tenant.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Unit</label>
                    <select name="unit" value={formData.unit} onChange={handleUnitChange} required className="w-full border p-2 rounded">
                        <option value="">Select Unit</option>
                        {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {unit.unit_number} - {unit.property_name} ({unit.unit_type})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Monthly Rent</label>
                    <input type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} min="0.01" step="0.01" required className="w-full border p-2 rounded" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Start Date</label>
                        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>

                    <div>
                        <label className="block mb-1">End Date</label>
                        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Monthly Rent Due Day</label>
                    <input type="number" name="rent_due_day" value={formData.rent_due_day} onChange={handleChange} min="1" max="31" required className="w-full border p-2 rounded" />
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50">
                        {submitting ? "Creating..." : "Create Tenancy"}
                    </button>
                    <Link to="/tenancies" className="border px-5 py-2 rounded">Cancel</Link>
                </div>
            </form>
        </div>
    );
}
