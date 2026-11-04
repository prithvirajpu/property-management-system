import { useEffect, useState } from "react";
import { registerToast } from "../../utils/toast";

const Toast = () => {
    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });

    useEffect(() => {
        registerToast((message, type) => {
            setToast({ message, type });
        });

        return () => registerToast(null);
    }, []);

    useEffect(() => {
        if (!toast.message) return;

        const timer = setTimeout(() => {
            setToast({ message: "", type: "success" });
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast]);

    if (!toast.message) return null;

    // Elegant styling variants matching your theme & status indicators
    const toastConfig = {
        success: {
            bg: "bg-[#F9EBDE] border-l-4 border-emerald-600 text-[#815854]",
            icon: (
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        error: {
            bg: "bg-[#F9EBDE] border-l-4 border-rose-600 text-[#815854]",
            icon: (
                <svg className="w-5 h-5 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        },
        warning: {
            bg: "bg-[#F9EBDE] border-l-4 border-amber-500 text-[#815854]",
            icon: (
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
        },
        info: {
            bg: "bg-[#F9EBDE] border-l-4 border-[#815854] text-[#815854]",
            icon: (
                <svg className="w-5 h-5 text-[#815854] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    const currentConfig = toastConfig[toast.type] || toastConfig.success;

    return (
        <div className="fixed top-15 right-5 z-50 max-w-md w-full px-4 sm:px-0 animate-slide-in">
            <div
                className={`${currentConfig.bg} px-5 py-3.5 rounded-lg shadow-xl border border-[#815854]/15 flex items-center justify-between gap-4 backdrop-blur-sm`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {currentConfig.icon}
                    <p className="text-sm font-medium tracking-wide truncate">
                        {toast.message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setToast({ message: "", type: "success" })
                    }
                    className="text-[#815854]/60 hover:text-[#815854] font-bold text-lg p-1 transition-colors leading-none"
                    aria-label="Close notification"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast;