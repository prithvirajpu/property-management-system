
export const validateTenant = (formData) => {
    const errors = {};

    const fields = ["full_name", "address"];

    fields.forEach((field) => {
        const value = String(formData[field] || "").trim();

        if (!value) {
            errors[field] = `${field === "full_name" ? "Full name" : "Address"} is required.`;
        } else if (/^\d+$/.test(value)) {
            errors[field] = "Only digits are not allowed.";
        } else if (/^_+$/.test(value)) {
            errors[field] = "Only underscores are not allowed.";
        }
    });

    // Email
    const email = String(formData.email || "").trim();

    if (!email) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid email address.";
    }

    // Phone
    const phone = String(formData.phone || "").trim();

    if (!phone) {
        errors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone)) {
        errors.phone = "Phone number must contain exactly 10 digits.";
    }

    return errors;
};
