
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getTenantDocuments,
    uploadTenantDocument,
    deleteTenantDocument,
} from "../../services/tenantService";

const TenantDocuments = () => {
    const { tenantId } = useParams();

    const [documents, setDocuments] = useState([]);
    const [documentType, setDocumentType] = useState("AADHAAR");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

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

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a document.");
            return;
        }

        const formData = new FormData();
        formData.append("document_type", documentType);
        formData.append("document", file);

        setUploading(true);
        setError("");

        try {
            await uploadTenantDocument(tenantId, formData);
            setFile(null);
            e.target.reset();
            await fetchDocuments();
        } catch (err) {
    console.log("Upload status:", err.response?.status);
    console.log("Upload response:", err.response?.data);
    console.log("Upload request:", err.config);

    setError(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Document upload failed."
    );
} finally {
            setUploading(false);
        }
    };

    const handleDelete = async (documentId) => {
        if (!window.confirm("Delete this document?")) return;

        try {
            await deleteTenantDocument(documentId);
            fetchDocuments();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete document.");
        }
    };

    return (
        <div>
            <Link to={`/tenants/${tenantId}`} className="text-blue-600">
                ← Back to Tenant
            </Link>

            <h2 className="text-2xl font-bold my-5">Tenant Documents</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form
                onSubmit={handleUpload}
                className="bg-white p-6 rounded-xl shadow-sm space-y-4 mb-6"
            >
                <div>
                    <label className="block mb-2 font-medium">
                        Document Type
                    </label>

                    <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="AADHAAR">Aadhaar</option>
                        <option value="PAN">PAN</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="DRIVING_LICENSE">Driving License</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Select Document (PDF, JPG, PNG)
                    </label>

                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg"
                >
                    {uploading ? "Uploading..." : "Upload Document"}
                </button>
            </form>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>

                {loading ? (
                    <p>Loading documents...</p>
                ) : documents.length === 0 ? (
                    <p className="text-gray-500">No documents uploaded.</p>
                ) : (
                    <div className="space-y-3">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="flex justify-between items-center border rounded-lg p-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {document.document_type}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {document.tenant_name}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDelete(document.id)}
                                    className="text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantDocuments;
