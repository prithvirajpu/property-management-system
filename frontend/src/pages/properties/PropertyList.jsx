import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProperties, deleteProperty } from "../../services/propertyService";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
} from "../../utils/toast";
import { handleApiError } from "../../utils/errorHandler";

const initialFilters = {
    search: "",
    location: "",
    ordering: "",
};

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pagination, setPagination] = useState(null);
    const [refresh, setRefresh] = useState(0);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
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

                const response = await getProperties(params);

                setProperties(response.data || []);
                setPagination(response.pagination || null);
            } catch (err) {
                handleApiError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
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

    const handleDeleteClick = (propertyId) => {
        setSelectedPropertyId(propertyId);
        setConfirmOpen(true);
    };

    const handleDelete = async (propertyId) => {
        try {
            await deleteProperty(propertyId);
            setRefresh((prev) => prev + 1);
            notifySuccess("Successfully deleted");
        } catch (err) {
            handleApiError(err);
        } finally {
            setConfirmOpen(false);
            setSelectedPropertyId(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-0 pb-10 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#815854]/15 pb-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#815854]">
                        Properties
                    </h2>
                    <p className="text-[#815854]/70 font-medium text-sm mt-1">
                        Manage your real estate properties and locations.
                    </p>
                </div>

                <Link
                    to="/properties/create"
                    className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm flex items-center gap-2"
                >
                    <span>+</span> Add Property
                </Link>
            </div>

            {/* Filter Controls Panel */}
            <div className="bg-[#F9EBDE] border border-[#815854]/20 p-4 sm:p-5 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search name, address or location..."
                    className="bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs"
                />

                <input
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    placeholder="Filter by exact location"
                    className="bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs"
                />

                <select
                    name="ordering"
                    value={filters.ordering}
                    onChange={handleChange}
                    className="bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs font-medium"
                >
                    <option value="">Default ordering</option>
                    <option value="name">Name: A to Z</option>
                    <option value="-name">Name: Z to A</option>
                    <option value="location">Location: A to Z</option>
                    <option value="-location">Location: Z to A</option>
                    <option value="-created_at">Newest first</option>
                    <option value="created_at">Oldest first</option>
                </select>

                <button
                    onClick={clearFilters}
                    className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-colors shadow-xs"
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
                        Loading properties...
                    </p>
                </div>
            ) : properties.length === 0 ? (
                <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl p-10 text-center text-[#815854] font-medium">
                    No properties found.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {properties.map((property) => (
                            <div
                                key={property.id}
                                className="bg-[#F9EBDE] border border-[#815854]/20 p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-base font-bold text-[#815854] tracking-tight">
                                            {property.name}
                                        </h3>
                                        <span className="bg-white border border-[#815854]/15 text-[#815854] px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                                            {property.location}
                                        </span>
                                    </div>

                                    <p className="text-[#815854]/75 text-xs leading-relaxed">
                                        {property.address}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-[#815854]/15 text-xs">
                                    <Link
                                        to={`/properties/${property.id}`}
                                        className="text-[#815854] font-semibold hover:underline"
                                    >
                                        View Details &rarr;
                                    </Link>

                                    <div className="flex items-center gap-3">
                                        <Link
                                            to={`/properties/${property.id}/edit`}
                                            className="text-[#815854] font-medium hover:underline"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDeleteClick(property.id)}
                                            className="text-rose-600 font-medium hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
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

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Delete Property"
                message="Are you sure you want to delete this property? This action cannot be undone."
                confirmText="Delete"
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedPropertyId(null);
                }}
                onConfirm={() => handleDelete(selectedPropertyId)}
            />
        </div>
    );
};

export default PropertyList;