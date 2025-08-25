import type { SKU } from "apps/vtex/utils/types.ts";
import { useId } from "../../sdk/useId.ts";
import { useComponent } from "../../sections/Component.tsx";

export interface Props {
  items: SKU[];
}

export default function Form({ items }: Props) {
  const slot = useId();

  const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    // Remove qualquer caractere não numérico
    let value = input.value.replace(/\D/g, "");

    // Limita a 8 dígitos
    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    // Aplica a máscara de CEP (XXXXX-XXX) após 5 dígitos
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{0,3})/, "$1-$2");
    }

    input.value = value;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector(
      'input[name="postalCode"]',
    ) as HTMLInputElement;

    // Remove o hífen antes de enviar
    if (input) {
      input.value = input.value.replace(/\D/g, "");
    }

    // Dispara o submit programaticamente para o htmx processar
    form.requestSubmit();
  };

  return (
    <div class="flex flex-col">
      <form
        class="relative join gap-2 mb-2"
        hx-target={`#${slot}`}
        hx-swap="innerHTML"
        hx-sync="this:replace"
        hx-post={useComponent(import.meta.resolve("./Results.tsx"), {
          items,
        })}
        onSubmit={handleSubmit}
      >
        <input
          as="input"
          type="text"
          class="w-full bg-[#D9D9D9] p-0 px-2 border-none outline-none "
          placeholder="00000-000"
          name="postalCode"
          maxLength={9} // Aumentado para 9 para acomodar o hífen
          size={9}
          onInput={handleInput}
        />
        <button
          type="submit"
          class="border-none outline-none bg-[#495941] min-w-[160px] h-8 py-1 px-3  text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-300  hover:bg-[rgba(108,131,88,0.9)]"
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
