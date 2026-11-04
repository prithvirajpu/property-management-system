
export const validateUnit = (formData) => {
    const errors = {};

    // Property
    if (!formData.property) {
        errors.property = "Please select a property.";
    }

    // Unit Number
    const unitNumber = String(formData.unit_number || "").trim();

    if (!unitNumber) {
        errors.unit_number = "Unit number is required.";
    } else if (/^_+$/.test(unitNumber)) {
        errors.unit_number = "Only underscores are not allowed.";
    }

    // Unit Type
    if (!formData.unit_type) {
        errors.unit_type = "Please select a unit type.";
    }

    // Monthly Rent
    if (formData.monthly_rent === "" || formData.monthly_rent === null) {
        errors.monthly_rent = "Monthly rent is required.";
    } else if (
        !Number.isFinite(Number(formData.monthly_rent)) ||
        Number(formData.monthly_rent) <= 0
    ) {
        errors.monthly_rent = "Monthly rent must be greater than 0.";
    }

    // Area (optional)
    if (
        formData.area !== "" &&
        formData.area !== null &&
        (
            !Number.isFinite(Number(formData.area)) ||
            Number(formData.area) < 0
        )
    ) {
        errors.area = "Area must be a valid non-negative number.";
    }

    // Floor (optional)
    if (
        formData.floor !== "" &&
        formData.floor !== null &&
        (
            !Number.isInteger(Number(formData.floor)) ||
            Number(formData.floor) < 0
        )
    ) {
        errors.floor = "Floor must be a valid non-negative integer.";
    }

    // Description (optional)
    const description = String(formData.description || "").trim();

    if (description && (/^\d+$/.test(description) || /^_+$/.test(description))) {
        errors.description = "Only digits or only underscores are not allowed.";
    }

    // Features (optional)
    if (Array.isArray(formData.features)) {
        const invalidFeature = formData.features.some((feature) => {
            const value = String(feature).trim();
            return /^\d+$/.test(value) || /^_+$/.test(value);
        });

        if (invalidFeature) {
            errors.features = "Features cannot contain only digits or only underscores.";
        }
    }

    return errors;
};
