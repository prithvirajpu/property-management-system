
export const validateTenancy = (formData) => {
    const errors = {};

    // Tenant
    if (!formData.tenant) {
        errors.tenant = "Please select a tenant.";
    }

    // Unit
    if (!formData.unit) {
        errors.unit = "Please select a unit.";
    }

    // Monthly Rent
    if (
        formData.monthly_rent === "" ||
        formData.monthly_rent === null ||
        formData.monthly_rent === undefined
    ) {
        errors.monthly_rent = "Monthly rent is required.";
    } else if (
        !Number.isFinite(Number(formData.monthly_rent)) ||
        Number(formData.monthly_rent) <= 0
    ) {
        errors.monthly_rent = "Monthly rent must be greater than 0.";
    }

    // Start Date
    if (!formData.start_date) {
        errors.start_date = "Start date is required.";
    }

    // End Date
    if (!formData.end_date) {
        errors.end_date = "End date is required.";
    } else if (
        formData.start_date &&
        formData.end_date < formData.start_date
    ) {
        errors.end_date = "End date cannot be earlier than start date.";
    }

    // Rent Due Day
    if (
        formData.rent_due_day === "" ||
        formData.rent_due_day === null ||
        formData.rent_due_day === undefined
    ) {
        errors.rent_due_day = "Rent due day is required.";
    } else if (
        !Number.isInteger(Number(formData.rent_due_day)) ||
        Number(formData.rent_due_day) < 1 ||
        Number(formData.rent_due_day) > 31
    ) {
        errors.rent_due_day = "Rent due day must be between 1 and 31.";
    }

    // Status (Edit)
    if (
        formData.status !== undefined &&
        !["ACTIVE", "COMPLETED", "TERMINATED"].includes(formData.status)
    ) {
        errors.status = "Please select a valid status.";
    }

    return errors;
};
