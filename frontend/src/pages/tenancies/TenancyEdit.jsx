
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTenancy, updateTenancy, patchTenancy } from "../../services/tenancyService";
import { getTenants } from "../../services/tenantService";
import { getUnits } from "../../services/unitService";

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

    useEffect(() => {
        const loadData = async () => {
            try {
                const [tenancyResponse, tenantResponse, unitResponse] = await Promise.all([
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
                setError(err.response?.data?.message || "Failed to load tenancy.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [tenancyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const payload = {
                ...formData,
                tenant: Number(formData.tenant),
                unit: Number(formData.unit),
                monthly_rent: Number(formData.monthly_rent),
                rent_due_day: Number(formData.rent_due_day),
            };

            const original = {
                ...originalData,
                tenant: Number(originalData.tenant),
                unit: Number(originalData.unit),
                monthly_rent: Number(originalData.monthly_rent),
                rent_due_day: Number(originalData.rent_due_day),
            };

            const changedData = {};

            fields.forEach((field) => {
                if (JSON.stringify(payload[field]) !== JSON.stringify(original[field])) {
                    changedData[field] = payload[field];
                }
            });

            if (Object.keys(changedData).length === 0) {
                alert("No changes detected.");
                return;
            }

            await patchTenancy(tenancyId, changedData);
            navigate(`/tenancies/${tenancyId}`);
        } catch (err) {
            setError(
                JSON.stringify(err.response?.data?.errors || err.response?.data) ||
                "Failed to update tenancy."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleFullUpdate = async () => {
        setError("");
        setSubmitting(true);

        try {
            await updateTenancy(tenancyId, {
                ...formData,
                tenant: Number(formData.tenant),
                unit: Number(formData.unit),
                monthly_rent: Number(formData.monthly_rent),
                rent_due_day: Number(formData.rent_due_day),
            });

            navigate(`/tenancies/${tenancyId}`);
        } catch (err) {
            setError(JSON.stringify(err.response?.data?.errors || err.response?.data) || "Failed to update tenancy.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="p-6">Loading tenancy...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Tenancy</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block mb-1">Tenant</label>
                    <select name="tenant" value={formData.tenant || ""} onChange={handleChange} required className="w-full border p-2 rounded">
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
                    <select name="unit" value={formData.unit || ""} onChange={handleChange} required className="w-full border p-2 rounded">
                        <option value="">Select Unit</option>
                        {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {unit.unit_number} - {unit.property_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Monthly Rent</label>
                    <input type="number" name="monthly_rent" value={formData.monthly_rent || ""} onChange={handleChange} min="0.01" step="0.01" required className="w-full border p-2 rounded" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Start Date</label>
                        <input type="date" name="start_date" value={formData.start_date || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>

                    <div>
                        <label className="block mb-1">End Date</label>
                        <input type="date" name="end_date" value={formData.end_date || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Rent Due Day</label>
                    <input type="number" name="rent_due_day" value={formData.rent_due_day || ""} onChange={handleChange} min="1" max="31" required className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label className="block mb-1">Status</label>
                    <select name="status" value={formData.status || "ACTIVE"} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="TERMINATED">Terminated</option>
                    </select>
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50">
                        {submitting ? "Saving..." : "Save Changes (PATCH)"}
                    </button>

                    <button type="button" onClick={handleFullUpdate} disabled={submitting} className="bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50">
                        Save Full Update (PUT)
                    </button>

                    <Link to={`/tenancies/${tenancyId}`} className="border px-5 py-2 rounded">Cancel</Link>
                </div>
            </form>
        </div>
    );
}
