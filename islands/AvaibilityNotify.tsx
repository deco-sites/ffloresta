import { Product } from "apps/commerce/types.ts";
import { useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface Props {
  productID: Product["productID"];
}

interface NotifyMeData {
  skuId: number;
  name: string;
  email: string;
  createdAt: string;
}

// Função para obter a data/hora no fuso horário de Brasília (GMT-3)
function getBrasiliaDateTime(): string {
  const now = new Date();

  // Converter para o fuso horário de Brasília (UTC-3)
  const offset = -3 * 60; // Brasília é UTC-3 (em minutos)
  const brasiliaTime = new Date(now.getTime() + offset * 60 * 1000);

  // Formatar no formato ISO que a VTEX espera
  return brasiliaTime.toISOString();
}

export default function AvailabilityNotify({ productID }: Props) {
  const isLoading = useSignal(false);
  const isSuccess = useSignal(false);
  const errorMessage = useSignal<string | null>(null);

  const handleSubmit = useCallback(
    async (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      if (!IS_BROWSER) return;

      isLoading.value = true;
      errorMessage.value = null;
      isSuccess.value = false;

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const name = `${formData.get("name") ?? ""}`;
      const email = `${formData.get("email") ?? ""}`;

      // Usar a função corrigida para horário de Brasília
      const createdAt = getBrasiliaDateTime();

      try {
        if (!name.trim() || !email.trim()) {
          throw new Error("Por favor, preencha todos os campos.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("Por favor, insira um email válido.");
        }

        const data: NotifyMeData = {
          skuId: parseInt(productID),
          name: name.trim(),
          email: email.trim(),
          createdAt,
        };

        const response = await fetch("/_v/createAvailabilityNotify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        isSuccess.value = true;
        form.reset();
      } catch (err) {
        console.error("Erro ao enviar dados:", err);
        errorMessage.value = err.message || "Erro ao enviar. Tente novamente.";
      } finally {
        isLoading.value = false;
      }
    },
    [productID]
  );

  const preventEnterSubmit = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }, []);

  return (
    <div class="notify-component">
      <form
        class="form-control justify-start gap-2"
        onSubmit={handleSubmit}
        onKeyDown={preventEnterSubmit}
      >
        <span class="text-base text-['Lato'] text-[#3A4332]">
          Este produto está indisponível no momento
        </span>
        <span class="text-sm text-['Lato'] text-[#3A4332]">
          Avise-me quando estiver disponível
        </span>

        <input
          placeholder="Nome"
          class="input input-bordered rounded-none bg-[#D9D9D9] border-none min-h-0 h-8 py-0 px-3 text-['Lato'] placeholder:text-sm focus:outline-none focus-within:outline-none outline-none"
          name="name"
          required
          disabled={isLoading.value}
        />
        <input
          placeholder="Email"
          type="email"
          class="input input-bordered rounded-none bg-[#D9D9D9] border-none min-h-0 h-8 py-0 px-3 text-['Lato'] placeholder:text-sm focus:outline-none focus-within:outline-none outline-none"
          name="email"
          required
          disabled={isLoading.value}
        />

        <button
          type="submit"
          class="btn btn-primary no-animation rounded-none min-h-0 h-8 bg-[#3A4332] hover:bg-[#0f130e] border-none text-['Lato']"
          disabled={isLoading.value}
        >
          {isLoading.value ? (
            <span class="loading loading-spinner loading-xs" />
          ) : (
            "Enviar"
          )}
        </button>
      </form>

      {isSuccess.value && (
        <div class="mt-2 p-2 bg-green-100 text-green-700 rounded text-sm">
          Obrigado! Você será notificado quando o produto estiver disponível.
        </div>
      )}

      {errorMessage.value && (
        <div class="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {errorMessage.value}
        </div>
      )}
    </div>
  );
}
