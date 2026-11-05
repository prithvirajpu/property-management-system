import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    pagination,
    onPageChange,
    onPageSizeChange,
}) => {
    if (!pagination || pagination.count === 0) {
        return null;
    }

    const {
        count,
        current_page,
        total_pages,
        page_size,
    } = pagination;

    const start = (current_page - 1) * page_size + 1;
    const end = Math.min(current_page * page_size, count);

    const getPages = () => {
        const pages = [];

        for (let i = 1; i <= total_pages; i++) {
            if (
                i === 1 ||
                i === total_pages ||
                Math.abs(i - current_page) <= 1
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }

        return pages;
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 border-t border-[#815854]/15 pt-4 text-sm">
            {/* Record Summary text */}
            <div className="text-[#815854]/80 font-medium text-center md:text-left">
                Showing <span className="font-semibold text-[#815854]">{start}</span>{" "}
                to{" "}
                <span className="font-semibold text-[#815854]">{end}</span>{" "}
                of{" "}
                <span className="font-semibold text-[#815854]">{count}</span> records
            </div>

            {/* Controls Section */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {/* Row limit selector */}
                <div className="flex items-center gap-2 mr-2">
                    <label className="text-[#815854]/80 font-medium">
                        Rows:
                    </label>
                    <select
                        value={page_size}
                        onChange={(e) =>
                            onPageSizeChange(Number(e.target.value))
                        }
                        className="bg-[#F9EBDE] border border-[#815854]/25 text-[#815854] rounded-md px-2.5 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#815854]"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                {/* Previous Page Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1}
                    aria-label="Previous page"
                    className="p-2 border border-[#815854]/25 rounded-md text-[#815854] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#815854]/10 transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-[260px] sm:max-w-none py-1">
                    {getPages().map((page, index) =>
                        page === "..." ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-[#815854]/60 font-medium"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                type="button"
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
                                    current_page === page
                                        ? "bg-[#815854] text-[#F9EBDE] border-[#815854] shadow-sm"
                                        : "bg-[#F9EBDE] text-[#815854] border-[#815854]/20 hover:bg-[#815854]/10"
                                }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Next Page Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === total_pages}
                    aria-label="Next page"
                    className="p-2 border border-[#815854]/25 rounded-md text-[#815854] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#815854]/10 transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;