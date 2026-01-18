import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange, onNext, onPrev }) => {
  const { page, totalPages, totalItems, hasNextPage, hasPrevPage, limit } =
    pagination;

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            i === page
              ? "bg-chart-1 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} jobs
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrevPage}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {renderPageNumbers()}

          <button
            onClick={onNext}
            disabled={!hasNextPage}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
