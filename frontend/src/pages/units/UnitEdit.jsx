
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUnit, updateUnit, patchUnit } from "../../services/unitService";
import { getProperties } from "../../services/propertyService";

const UnitEdit = () => {
    const { unitId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
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
    } catch (err) {
        setError(
            err.response?.data?.message ||
            JSON.stringify(err.response?.data?.errors || {}) ||
            "Failed to update unit."
        );
    } finally {
        setSaving(false);
    }
};


    if (loading) return <p>Loading unit...</p>;
    if (!formData) return <p className="text-red-600">{error || "Unit not found."}</p>;

    return (
        <div className="max-w-3xl">
            <Link to={`/units/${unitId}`} className="text-blue-600">
                ← Back to Unit
            </Link>

            <h2 className="text-2xl font-bold my-5">Edit Unit</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form
                onSubmit={(e) => handleSubmit(e, false)}
                className="bg-white p-6 rounded-xl shadow-sm space-y-5"
            >
                <div>
                    <label className="block mb-2 font-medium">Property</label>
                    <select
                        name="property"
                        value={formData.property}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    >
                        {properties.map((property) => (
                            <option key={property.id} value={property.id}>
                                {property.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Unit Number</label>
                    <input
                        name="unit_number"
                        value={formData.unit_number || ""}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Unit Type</label>
                    <select
                        name="unit_type"
                        value={formData.unit_type}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    >
                        {["1BHK", "2BHK", "3BHK", "4BHK"].map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Monthly Rent</label>
                    <input
                        type="number"
                        name="monthly_rent"
                        value={formData.monthly_rent}
                        onChange={handleChange}
                        min="1"
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Area</label>
                    <input
                        type="number"
                        name="area"
                        value={formData.area ?? ""}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Floor</label>
                    <input
                        type="number"
                        name="floor"
                        value={formData.floor ?? ""}
                        onChange={handleChange}
                        min="0"
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
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
                        {saving ? "Saving..." : "Save All Changes (PUT)"}
                    </button>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={(e) => handleSubmit(e, true)}
                        className="bg-green-600 text-white px-5 py-3 rounded-lg"
                    >
                        Save Rent & Description (PATCH)
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UnitEdit;
