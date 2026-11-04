
import { notifyError } from "./toast";

const extractErrors = (errors) => {
    if (typeof errors === "string") {
        return errors;
    }

    if (Array.isArray(errors)) {
        return errors.map(extractErrors).join(", ");
    }

    if (typeof errors === "object" && errors !== null) {
        return Object.entries(errors)
            .map(([field, messages]) => {
                return `${field}: ${extractErrors(messages)}`;
            })
            .join(" | ");
    }

    return "Something went wrong.";
};

export const handleApiError = (error) => {
    const responseData = error.response?.data;

    if (responseData?.errors) {
        notifyError(extractErrors(responseData.errors));
        return;
    }

    if (responseData?.message) {
        notifyError(responseData.message);
        return;
    }

    if (!error.response) {
        notifyError("Unable to connect to the server. Please try again.");
        return;
    }

    notifyError("Something went wrong. Please try again.");
};
