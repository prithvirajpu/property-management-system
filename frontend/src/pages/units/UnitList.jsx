import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUnits, deleteUnit } from "../../services/unitService";
import { getProperties } from "../../services/propertyService";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import { notifyError, notifySuccess } from "../../utils/toast";

const initialFilters = {
    search: "",
    property: "",
    unit_type: "",
    floor: "",
    min_rent: "",
    max_rent: "",
    ordering: "",
};

const UnitList = () => {
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pagination, setPagination] = useState(null);
    const [refresh, setRefresh] = useState(0);
    
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUnitId, setSelectedUnitId] = useState(null);

    useEffect(() => {
        const loadProperties = async () => {
            try {
                const response = await getProperties({
                    page: 1,
                    page_size: 100,
                });

                setProperties(response.data || []);
            } catch {
                setError("Failed to load properties for filtering.");
            }
        };

        loadProperties();
    }, []);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {
                    ...Object.fromEntries(
                        Object.entries(filters).filter(
                            ([, value]) => value !== ""
                        )
                    ),
                    page,
                    page_size: pageSize,
                };

                const response = await getUnits(params);

                setUnits(response.data || []);
                setPagination(response.pagination || null);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load units."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, [filters, page, pageSize, refresh]);

    const handleChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        setPage(1);
    };

    const clearFilters = () => {
        setFilters(initialFilters);
        setPage(1);
    };

    const handleDeleteClick = (unitId) => {
        setSelectedUnitId(unitId);
        setConfirmOpen(true);
    };

    const handleDelete = async (unitId) => {
        try {
            await deleteUnit(unitId);
            setRefresh((prev) => prev + 1);
            notifySuccess("Successfully deleted");
        } catch (err) {
            notifyError(
                err.response?.data?.message ||
                "Failed to delete unit."
            );
        } finally {
            setConfirmOpen(false);
            setSelectedUnitId(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-0 pb-10 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#815854]/15 pb-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#815854]">
                        Units
                    </h2>
                    <p className="text-[#815854]/70 font-medium text-sm mt-1">
                        Manage property units and rental listings.
                    </p>
                </div>

                <Link
                    to="/units/create"
                    className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm flex items-center gap-2"
                >
                    <span>+</span> Add Unit
                </Link>
            </div>

            {/* Filter Panel */}
            <div className="bg-[#F9EBDE] border border-[#815854]/20 p-4 sm:p-5 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <input
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search unit number or property..."
                    className="bg-white border border-[#815854]/25 rounded-md px-3.5 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-2xs"
                />

                <select
                    name="property"
                    value={filters.property}
                    onChange={handleChange}
                    className="bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-2xs font-medium"
                >
                    <option value="">All Properties</option>
                    {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                            {property.name}
                        </option>
                    ))}
                </select>

                <select
                    name="unit_type"
                    value={filters.unit_type}
                    onChange={handleChange}
                    className="bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-2xs font-medium"
                >
                    <option value="">All Unit Types</option>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                </select>

                <input
                    type="number"
                    name="floor"
                    value={filters.floor}
                    onChange={handleChange}
                    placeholder="Floor number"
                    className="bg-white border border-[#815854]/25 rounded-md px-3.5 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-2xs"
                />

                <input
                    type="number"
                    name="min_rent"
                    value={filters.min_rent}
                    onChange={handleChange}
                    placeholder="Minimum rent"
                    min="0"
                    className="bg-white border border-[#815854]/25 rounded-md px-3.5 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-2xs"
                />

                <input
                    type="number"
                    name="max_rent"
                    value={filters.max_rent}
                    onChange={handleChange}
                    placeholder="Maximum rent"
                    min="0"
                    className="bg-white border border-[#815854]/25 rounded-md px-3.5 py-2 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-2xs"
                />

                <select
                    name="ordering"
                    value={filters.ordering}
                    onChange={handleChange}
                    className="bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-2xs font-medium"
                >
                    <option value="">Default ordering</option>
                    <option value="monthly_rent">Rent: Low to High</option>
                    <option value="-monthly_rent">Rent: High to Low</option>
                    <option value="unit_number">Unit: A to Z</option>
                    <option value="-unit_number">Unit: Z to A</option>
                    <option value="floor">Floor: Low to High</option>
                    <option value="-floor">Floor: High to Low</option>
                    <option value="-created_at">Newest first</option>
                    <option value="created_at">Oldest first</option>
                </select>

                <button
                    onClick={clearFilters}
                    className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 rounded-md px-4 py-2 text-xs font-semibold transition-colors shadow-2xs"
                >
                    Clear Filters
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-800 rounded-r-lg text-sm font-medium shadow-sm">
                    {error}
                </div>
            )}

            {/* Content Display */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <p className="text-[#815854] font-medium text-sm animate-pulse">
                        Loading units...
                    </p>
                </div>
            ) : units.length === 0 ? (
                <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl p-10 text-center text-[#815854] font-medium">
                    No units found.
                </div>
            ) : (
                <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                                <tr className="bg-[#815854] text-[#F9EBDE]">
                                    <th className="p-3.5 font-semibold">Unit Number</th>
                                    <th className="p-3.5 font-semibold">Property</th>
                                    <th className="p-3.5 font-semibold">Type</th>
                                    <th className="p-3.5 font-semibold">Monthly Rent</th>
                                    <th className="p-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#815854]/15">
                                {units.map((unit) => (
                                    <tr key={unit.id} className="hover:bg-white/40 transition-colors">
                                        <td className="p-3.5 font-semibold text-[#815854]">
                                            {unit.unit_number}
                                        </td>

                                        <td className="p-3.5 text-[#815854]/80">
                                            {unit.property_name || unit.property}
                                        </td>

                                        <td className="p-3.5 text-[#815854]/80">
                                            {unit.unit_type}
                                        </td>

                                        <td className="p-3.5 font-medium text-[#815854]">
                                            ₹{unit.monthly_rent}
                                        </td>

                                        <td className="p-3.5 text-right">
                                            <div className="flex items-center justify-end gap-3 font-medium text-xs">
                                                <Link
                                                    to={`/units/${unit.id}`}
                                                    className="text-[#815854] hover:underline"
                                                >
                                                    View
                                                </Link>

                                                <Link
                                                    to={`/units/${unit.id}/edit`}
                                                    className="text-[#815854] hover:underline"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => handleDeleteClick(unit.id)}
                                                    className="text-rose-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <Pagination
                pagination={pagination}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Delete Unit"
                message="Are you sure you want to delete this unit? This action cannot be undone."
                confirmText="Delete"
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedUnitId(null);
                }}
                onConfirm={() => handleDelete(selectedUnitId)}
            />
        </div>
    );
};

export default UnitList;