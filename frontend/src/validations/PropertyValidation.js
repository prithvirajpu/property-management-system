export const validateProperty = (formData) => {
    const errors = {};

    const fields = ["name", "address", "location"];

    fields.forEach((field) => {
        const value = formData[field].trim();

        if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        } else if (/^\d+$/.test(value)) {
            errors[field] = "Only digits are not allowed.";
        } else if (/^_+$/.test(value)) {
            errors[field] = "Only underscores are not allowed.";
        }
    });

    return errors;
};