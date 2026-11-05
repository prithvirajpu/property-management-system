
let toastHandler = null;

export const registerToast = (handler) => {
    toastHandler = handler;
};

export const notifySuccess = (msg) => {
    toastHandler?.(msg, "success");
};

export const notifyError = (msg) => {
    toastHandler?.(msg, "error");
};

export const notifyWarning = (msg) => {
    toastHandler?.(msg, "warning");
};

export const notifyInfo = (msg) => {
    toastHandler?.(msg, "info");
};
