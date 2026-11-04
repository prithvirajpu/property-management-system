
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getTenant,
    updateTenant,
    patchTenant,
} from "../../services/tenantService";

const TenantEdit = () => {
    const { tenantId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e, partial = false) => {
        e.preventDefault();
        setError("");
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
        } catch (err) {
            setError(
                err.response?.data?.message ||
                JSON.stringify(err.response?.data?.errors || {}) ||
                "Failed to update tenant."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading tenant...</p>;
    if (!formData) return <p>{error || "Tenant not found."}</p>;

    return (
        <div className="max-w-2xl">
            <Link to={`/tenants/${tenantId}`} className="text-blue-600">
                ← Back to Tenant
            </Link>

            <h2 className="text-2xl font-bold my-5">Edit Tenant</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form
                onSubmit={(e) => handleSubmit(e, false)}
                className="bg-white p-6 rounded-xl shadow-sm space-y-5"
            >
                {[
                    { name: "full_name", label: "Full Name" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "phone", label: "Phone" },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="block mb-2 font-medium">
                            {field.label}
                        </label>

                        <input
                            type={field.type || "text"}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3"
                        />
                    </div>
                ))}

                <div>
                    <label className="block mb-2 font-medium">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg"
                    >
                        Save All Changes (PUT)
                    </button>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={(e) => handleSubmit(e, true)}
                        className="bg-green-600 text-white px-5 py-3 rounded-lg"
                    >
                        Save Changed Fields (PATCH)
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TenantEdit;
