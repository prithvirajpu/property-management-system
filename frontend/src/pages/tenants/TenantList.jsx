import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTenants, deleteTenant } from "../../services/tenantService";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import { notifyError, notifySuccess } from "../../utils/toast";

const TenantList = () => {
    const [tenants, setTenants] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pagination, setPagination] = useState(null);
    const [refresh, setRefresh] = useState(0);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedTenantId, setSelectedTenantId] = useState(null);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {
                    search,
                    page,
                    page_size: pageSize,
                };

                const response = await getTenants(params);

                setTenants(response.data || []);
                setPagination(response.pagination || null);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load tenants."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTenants();
    }, [search, page, pageSize, refresh]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const clearSearch = () => {
        setSearch("");
        setPage(1);
    };

    const handleDeleteClick = (tenantId) => {
        setSelectedTenantId(tenantId);
        setConfirmOpen(true);
    };

    const handleDelete = async (tenantId) => {
        try {
            await deleteTenant(tenantId);
            setRefresh((prev) => prev + 1);
            notifySuccess("Successfully deleted");
        } catch (err) {
            notifyError(
                err.response?.data?.message ||
                "Failed to delete tenant."
            );
        } finally {
            setConfirmOpen(false);
            setSelectedTenantId(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-0 pb-10 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#815854]/15 pb-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#815854]">
                        Tenants
                    </h2>
                    <p className="text-[#815854]/70 font-medium text-sm mt-1">
                        Manage tenant information and documentation.
                    </p>
                </div>

                <Link
                    to="/tenants/create"
                    className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm flex items-center gap-2"
                >
                    <span>+</span> Add Tenant
                </Link>
            </div>

            {/* Search Filter Panel */}
            <div className="bg-[#F9EBDE] border border-[#815854]/20 p-4 sm:p-5 rounded-xl shadow-sm flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by name, email, phone or address..."
                    className="flex-1 bg-white border border-[#815854]/25 rounded-lg px-3.5 py-2.5 text-[#815854] placeholder-[#815854]/40 outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-xs"
                />

                <button
                    onClick={clearSearch}
                    className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors shadow-xs whitespace-nowrap"
                >
                    Clear Search
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
                        Loading tenants...
                    </p>
                </div>
            ) : tenants.length === 0 ? (
                <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl p-10 text-center text-[#815854] font-medium">
                    No matching tenants found.
                </div>
            ) : (
                <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                                <tr className="bg-[#815854] text-[#F9EBDE]">
                                    <th className="p-3.5 font-semibold">Name</th>
                                    <th className="p-3.5 font-semibold">Email</th>
                                    <th className="p-3.5 font-semibold">Phone</th>
                                    <th className="p-3.5 font-semibold">Address</th>
                                    <th className="p-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#815854]/15">
                                {tenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-white/40 transition-colors">
                                        <td className="p-3.5 font-semibold text-[#815854]">
                                            {tenant.full_name}
                                        </td>

                                        <td className="p-3.5 text-[#815854]/80">
                                            {tenant.email}
                                        </td>

                                        <td className="p-3.5 text-[#815854]/80">
                                            {tenant.phone}
                                        </td>

                                        <td className="p-3.5 text-[#815854]/80 max-w-xs truncate">
                                            {tenant.address}
                                        </td>

                                        <td className="p-3.5 text-right">
                                            <div className="flex items-center justify-end gap-3 font-medium text-xs">
                                                <Link
                                                    to={`/tenants/${tenant.id}`}
                                                    className="text-[#815854] hover:underline"
                                                >
                                                    View
                                                </Link>

                                                <Link
                                                    to={`/tenants/${tenant.id}/edit`}
                                                    className="text-[#815854] hover:underline"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => handleDeleteClick(tenant.id)}
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
                title="Delete Tenant"
                message="Are you sure you want to delete this tenant? This action cannot be undone."
                confirmText="Delete"
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedTenantId(null);
                }}
                onConfirm={() => handleDelete(selectedTenantId)}
            />
        </div>
    );
};

export default TenantList;