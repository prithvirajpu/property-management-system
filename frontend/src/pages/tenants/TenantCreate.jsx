
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTenant } from "../../services/tenantService";

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await createTenant(formData);
            const tenant = response.data;

            navigate(`/tenants/${tenant.id}/documents`);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                JSON.stringify(err.response?.data?.errors || {}) ||
                "Failed to create tenant."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Add Tenant</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-sm space-y-5"
            >
                <div>
                    <label className="block mb-2 font-medium">Full Name</label>
                    <input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

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

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                    {loading ? "Saving..." : "Create Tenant"}
                </button>
            </form>
        </div>
    );
};

export default TenantCreate;
