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
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    window.location.href = url.pathname + "?" + url.searchParams.toString();
  };

  return (
    <div class="flex justify-center items-center gap-4 mt-8">
      {currentPage > 1 && (
        <button
          onClick={() => handleNavigate(currentPage - 1)}
          class="px-4 py-2 bg-[#c6cfba] text-[#323f2d] font-bold text-sm hover:underline"
        >
          Ver menos
        </button>
      )}

      {currentPage < totalPages && (
        <button
          onClick={() => handleNavigate(currentPage + 1)}
          class="px-4 py-2 bg-[#c6cfba] text-[#323f2d] font-bold text-sm hover:underline"
        >
          Ver mais
        </button>
      )}
    </div>
  );
}
