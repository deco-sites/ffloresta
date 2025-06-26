import type { SKU } from "apps/vtex/utils/types.ts";
import { useId } from "../../sdk/useId.ts";
import { useComponent } from "../../sections/Component.tsx";

export interface Props {
  items: SKU[];
}

export default function Form({ items }: Props) {
  const slot = useId();

  return (
    <div class="flex flex-col  font-['FS_Emeric']">
      <form
        class="relative join gap-2 mb-2"
        hx-target={`#${slot}`}
        hx-swap="innerHTML"
        hx-sync="this:replace"
        hx-post={useComponent(import.meta.resolve("./Results.tsx"), {
          items,
        })}
      >
        <input
          as="input"
          type="text"
          class="w-full bg-[#D9D9D9] p-0 px-2 border-none outline-none font-['FS_Emeric']"
          placeholder="00000000"
          name="postalCode"
          maxLength={8}
          size={8}
        />
        <button
          type="submit"
          class="border-none outline-none bg-[#495941] min-w-[160px] h-8 py-1 px-3 font-['FS_Emeric'] text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-300  hover:bg-[rgba(108,131,88,0.9)]"
        >
          <span class="[.htmx-request_&]:hidden inline">CALCULAR FRETE</span>
          <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
        </button>
      </form>

      {/* Results Slot */}
      <div id={slot} />
    </div>
  );
}
