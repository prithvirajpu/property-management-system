import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTenancies, deleteTenancy } from "../../services/tenancyService";
import { getTenants } from "../../services/tenantService";
import { getProperties } from "../../services/propertyService";
import { getUnits } from "../../services/unitService";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import { notifyError, notifySuccess } from "../../utils/toast";

const initialFilters = {
    search: "",
    tenant: "",
    property: "",
    unit: "",
    status: "",
    ordering: "",
};

export default function TenancyList() {
    const [tenancies, setTenancies] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [properties, setProperties] = useState([]);
    const [units, setUnits] = useState([]);

    const [filters, setFilters] = useState(initialFilters);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pagination, setPagination] = useState(null);
    const [refresh, setRefresh] = useState(0);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);

    // Load filter dropdown options
    useEffect(() => {
        const loadOptions = async () => {
            try {
                const params = {
                    page: 1,
                    page_size: 100,
                };

                const [
                    tenantResponse,
                    propertyResponse,
                    unitResponse,
                ] = await Promise.all([
                    getTenants(params),
                    getProperties(params),
                    getUnits(params),
                ]);

                setTenants(tenantResponse.data || []);
                setProperties(propertyResponse.data || []);
                setUnits(unitResponse.data || []);
            } catch {
                setError("Failed to load filter options.");
            }
        };

        loadOptions();
    }, []);

    // Fetch paginated tenancies
    useEffect(() => {
        const loadTenancies = async () => {
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

                const response = await getTenancies(params);

                setTenancies(response.data || []);
                setPagination(response.pagination || null);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load tenancies."
                );
            } finally {
                setLoading(false);
            }
        };

        loadTenancies();
    }, [filters, page, pageSize, refresh]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "property" ? { unit: "" } : {}),
        }));

        setPage(1);
    };

    const clearFilters = () => {
        setFilters(initialFilters);
        setPage(1);
    };

    const filteredUnits = filters.property
        ? units.filter(
            (unit) => String(unit.property) === filters.property
        )
        : units;

    const handleDeleteClick = (propertyId) => {
        setSelectedPropertyId(propertyId);
        setConfirmOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteTenancy(id);
            setRefresh((prev) => prev + 1);
            notifySuccess("Successfully deleted.");
        } catch (err) {
            notifyError(
                err.response?.data?.message ||
                "Failed to delete tenancy."
            );
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
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#815854]">
                        Tenancies
                    </h1>
                    <p className="text-[#815854]/70 font-medium text-sm mt-1">
                        Manage rental agreements and tenant assignments.
                    </p>
                </div>

                <Link
                    to="/tenancies/create"
                    className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm flex items-center gap-2"
                >
                    <span>+</span> Add Tenancy
                </Link>
            </div>

            {/* Filter Controls Panel */}
            <div className="bg-[#F9EBDE] border border-[#815854]/20 p-4 sm:p-5 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                <input
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search tenancies..."
                    className="bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs"
                />

                <select
                    name="tenant"
                    value={filters.tenant}
                    onChange={handleChange}
                    className="bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs font-medium"
                >
                    <option value="">All Tenants</option>
                    {tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                            {tenant.full_name}
                        </option>
                    ))}
                </select>

                <select
                    name="property"
                    value={filters.property}
                    onChange={handleChange}
                    className="bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs font-medium"
                >
                    <option value="">All Properties</option>
                    {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                            {property.name}
                        </option>
                    ))}
                </select>

                <select
                    name="unit"
                    value={filters.unit}
                    onChange={handleChange}
                    className="bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs font-medium"
                >
                    <option value="">All Units</option>
                    {filteredUnits.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                            Unit {unit.unit_number}
                        </option>
                    ))}
                </select>

                <select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    className="bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs font-medium"
                >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="TERMINATED">Terminated</option>
                </select>

                <div className="flex gap-2">
                    <select
                        name="ordering"
                        value={filters.ordering}
                        onChange={handleChange}
                        className="flex-1 bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs font-medium"
                    >
                        <option value="">Default ordering</option>
                        <option value="start_date">Start date: Oldest</option>
                        <option value="-start_date">Start date: Newest</option>
                        <option value="monthly_rent">Rent: Low to High</option>
                        <option value="-monthly_rent">Rent: High to Low</option>
                    </select>

                    <button
                        onClick={clearFilters}
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors shadow-xs whitespace-nowrap"
                    >
                        Clear
                    </button>
                </div>
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
                        Loading tenancies...
                    </p>
                </div>
            ) : tenancies.length === 0 ? (
                <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl p-10 text-center text-[#815854] font-medium">
                    No matching tenancies found.
                </div>
            ) : (
                <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-[#815854] text-[#F9EBDE]">
                                    <th className="p-3.5 font-semibold">Tenant</th>
                                    <th className="p-3.5 font-semibold">Property</th>
                                    <th className="p-3.5 font-semibold">Unit</th>
                                    <th className="p-3.5 font-semibold">Monthly Rent</th>
                                    <th className="p-3.5 font-semibold">Start Date</th>
                                    <th className="p-3.5 font-semibold">End Date</th>
                                    <th className="p-3.5 font-semibold">Status</th>
                                    <th className="p-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#815854]/15">
                                {tenancies.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/40 transition-colors">
                                        <td className="p-3.5 font-semibold text-[#815854]">
                                            {item.tenant_name}
                                        </td>
                                        <td className="p-3.5 text-[#815854]/80">
                                            {item.property_name}
                                        </td>
                                        <td className="p-3.5 text-[#815854]/80">
                                            Unit {item.unit_number}
                                        </td>
                                        <td className="p-3.5 font-medium text-[#815854]">
                                            ₹{item.monthly_rent}
                                        </td>
                                        <td className="p-3.5 text-[#815854]/80">
                                            {item.start_date}
                                        </td>
                                        <td className="p-3.5 text-[#815854]/80">
                                            {item.end_date}
                                        </td>
                                        <td className="p-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                item.status === "ACTIVE" 
                                                    ? "bg-emerald-100 text-emerald-800" 
                                                    : "bg-amber-100 text-amber-800"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right">
                                            <div className="flex items-center justify-end gap-3 font-medium text-xs">
                                                <Link
                                                    to={`/tenancies/${item.id}`}
                                                    className="text-[#815854] hover:underline"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`/tenancies/${item.id}/edit`}
                                                    className="text-[#815854] hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(item.id)}
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

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Delete Tenancy"
                message="Are you sure you want to delete this tenancy? This action cannot be undone."
                confirmText="Delete"
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedPropertyId(null);
                }}
                onConfirm={() => handleDelete(selectedPropertyId)}
            />
        </div>
    );
}