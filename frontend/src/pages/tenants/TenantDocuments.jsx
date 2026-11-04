import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getTenantDocuments,
    uploadTenantDocument,
    deleteTenantDocument,
} from "../../services/tenantService";
import { validateTenantDocument } from "../../validations/tenantDocumentValidation";
import ConfirmModal from "../../components/common/ConfirmModal";
import { notifyError, notifySuccess } from "../../utils/toast";

const TenantDocuments = () => {
    const { tenantId } = useParams();

    const [documents, setDocuments] = useState([]);
    const [documentType, setDocumentType] = useState("AADHAAR");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await getTenantDocuments(tenantId);
            setDocuments(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load documents.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [tenantId]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0] || null;

        setFile(selectedFile);
        setErrors((prev) => ({
            ...prev,
            document: "",
        }));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setError("");

        const validationErrors = validateTenantDocument(file);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const formData = new FormData();
        formData.append("document_type", documentType);
        formData.append("document", file);

        setUploading(true);

        try {
            await uploadTenantDocument(tenantId, formData);
            notifySuccess("Successfully uploaded");
            setFile(null);
            e.target.reset();

            await fetchDocuments();
        } catch (err) {
            notifyError(
                err.response?.data?.message ||
                JSON.stringify(err.response?.data) ||
                "Document upload failed."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteClick = (documentId) => {
        setSelectedDocumentId(documentId);
        setConfirmOpen(true);
    };

    const handleDelete = async (documentId) => {
        try {
            await deleteTenantDocument(documentId);
            notifySuccess("Successfully deleted");
            fetchDocuments();
        } catch (err) {
            notifyError(err.response?.data?.message || "Failed to delete document.");
        } finally {
            setConfirmOpen(false);
            setSelectedDocumentId(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8 space-y-6">
            {/* Header & Navigation */}
            <div className="flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <Link
                    to={`/tenants/${tenantId}`}
                    className="text-xs font-semibold text-[#815854]/70 hover:text-[#815854] underline transition-colors"
                >
                    &larr; Back to Tenant
                </Link>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#815854]">
                    Tenant Documents
                </h2>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-800 rounded-r-lg text-sm font-medium shadow-sm">
                    {error}
                </div>
            )}

            {/* Upload Form Container */}
            <form
                onSubmit={handleUpload}
                className="bg-[#F9EBDE] border border-[#815854]/20 p-5 sm:p-6 rounded-xl shadow-sm space-y-4"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Document Type
                        </label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-2 text-[#815854] outline-none focus:ring-1 focus:ring-[#815854] text-xs shadow-sm font-medium"
                        >
                            <option value="AADHAAR">Aadhaar</option>
                            <option value="PAN">PAN</option>
                            <option value="PASSPORT">Passport</option>
                            <option value="DRIVING_LICENSE">Driving License</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-[#815854]">
                            Select Document (PDF, JPG, PNG)
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="w-full bg-white border border-[#815854]/25 rounded-md px-3 py-1.5 text-[#815854] file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#815854] file:text-[#F9EBDE] hover:file:bg-[#815854]/90 outline-none text-xs shadow-sm"
                        />
                        {errors.document && (
                            <p className="text-rose-600 text-[11px] mt-1">{errors.document}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={uploading}
                        className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-5 py-2 rounded-md shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all text-xs"
                    >
                        {uploading ? "Uploading..." : "Upload Document"}
                    </button>
                </div>
            </form>

            {/* Uploaded Documents List Container */}
            <div className="bg-[#F9EBDE] border border-[#815854]/20 p-5 sm:p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="text-sm sm:text-base font-semibold text-[#815854] border-b border-[#815854]/15 pb-2">
                    Uploaded Documents
                </h3>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <p className="text-[#815854] font-medium text-xs animate-pulse">
                            Loading documents...
                        </p>
                    </div>
                ) : documents.length === 0 ? (
                    <p className="text-xs text-[#815854]/60 italic">
                        No documents uploaded.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="flex justify-between items-center bg-white border border-[#815854]/20 rounded-lg p-3.5 shadow-xs"
                            >
                                <div>
                                    <p className="font-bold text-xs sm:text-sm text-[#815854]">
                                        {document.document_type}
                                    </p>
                                    <p className="text-[11px] text-[#815854]/70 mt-0.5">
                                        {document.tenant_name}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleDeleteClick(document.id)}
                                    className="text-rose-600 hover:text-rose-800 font-semibold text-xs transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Delete Document"
                message="Are you sure you want to delete this document? This action cannot be undone."
                confirmText="Delete"
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedDocumentId(null);
                }}
                onConfirm={() => handleDelete(selectedDocumentId)}
            />
        </div>
    );
};

export default TenantDocuments;