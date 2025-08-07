interface Props {
  currentPage: number;
  records: number;
  recordPerPage: number;
}

export default function PaginationButtons({
  currentPage,
  records,
  recordPerPage,
}: Props) {
  const totalPages = Math.ceil(records / recordPerPage);

  const handleNavigate = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    window.location.href = url.pathname + "?" + url.searchParams.toString();
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div class="flex justify-center items-center gap-4 mt-8">
      <div class="flex gap-2">
        {/* Botão Anterior */}
        <button
          onClick={() => handleNavigate(currentPage - 1)}
          aria-label="Página anterior"
          disabled={isFirstPage}
          class={`transition-all duration-300 hover:scale-105 ${
            isFirstPage ? "opacity-50 cursor-not-allowed" : "hover:opacity-100"
          }`}
        >
          <div
            class={`p-2 rounded-full ${
              isFirstPage
                ? "bg-[rgba(21,31,22,0.3)]"
                : "bg-[rgba(21,31,22,0.6)] hover:bg-[rgba(21,31,22,0.8)]"
            } backdrop-blur-[12px] transition-all duration-300`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              aria-hidden="true"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </button>

        {/* Botão Próximo */}
        <button
          onClick={() => handleNavigate(currentPage + 1)}
          aria-label="Próxima página"
          disabled={isLastPage}
          class={`transition-all duration-300 hover:scale-105 ${
            isLastPage ? "opacity-50 cursor-not-allowed" : "hover:opacity-100"
          }`}
        >
          <div
            class={`p-2 rounded-full ${
              isLastPage
                ? "bg-[rgba(21,31,22,0.3)]"
                : "bg-[rgba(21,31,22,0.6)] hover:bg-[rgba(21,31,22,0.8)]"
            } backdrop-blur-[12px] transition-all duration-300`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              aria-hidden="true"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
