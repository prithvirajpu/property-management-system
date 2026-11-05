function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs px-4">
            <div
                className="w-full max-w-sm rounded-xl bg-[#F9EBDE] border border-[#815854]/20 p-5 sm:p-6 shadow-xl space-y-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
            >
                <div className="space-y-1.5">
                    <h2
                        id="confirm-modal-title"
                        className="text-base sm:text-lg font-bold text-[#815854]"
                    >
                        {title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#815854]/80 leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#815854]/15">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white hover:bg-gray-50 text-[#815854] border border-[#815854]/25 font-semibold px-4 py-2 rounded-md text-xs transition-colors shadow-2xs"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-4 py-2 rounded-md text-xs shadow-sm transition-all"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;