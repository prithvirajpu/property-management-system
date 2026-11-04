
export const validateTenantDocument = (file) => {
    const errors = {};

    if (!file) {
        errors.document = "Please select a document.";
        return errors;
    }

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
        errors.document = "Only PDF, JPG, JPEG and PNG files are allowed.";
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
        errors.document = "Document size must not exceed 5 MB.";
    }

    return errors;
};
