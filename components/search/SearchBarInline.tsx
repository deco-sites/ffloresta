import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import Searchbar from "./Searchbar/Form.tsx";
import type { SearchbarProps } from "./Searchbar/Form.tsx";

export default function SearchbarInline(props: SearchbarProps) {
  const open = useSignal(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        open.value = false;
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div class="relative w-full max-w-[638px]" ref={containerRef}>
      <div onClick={() => (open.value = true)}>
        <Searchbar {...props} />
      </div>

      {/* overlay suggestions sempre dentro do Searchbar via slot */}
      {/* nada de modal, nada de drawer */}
    </div>
  );
}
