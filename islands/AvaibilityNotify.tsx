import { Product } from "apps/commerce/types.ts";
import { useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";

export interface Props {
  productID: Product["productID"];
}

interface NotifyMeData {
  skuId: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function AvaibilityNotify({ productID }: Props) {
  const isLoading = useSignal(false);
  const isSuccess = useSignal(false);
  const errorMessage = useSignal<string | null>(null);

  const handleSubmit = useCallback(
    async (e: Event) => {
      e.preventDefault();

      isLoading.value = true;
      errorMessage.value = null;
      isSuccess.value = false;

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const name = `${formData.get("name") ?? ""}`;
      const email = `${formData.get("email") ?? ""}`;
      const createdAt = new Date().toISOString();

      try {
        // Validação básica dos campos
        if (!name.trim() || !email.trim()) {
          throw new Error("Por favor, preencha todos os campos.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("Por favor, insira um email válido.");
        }

        // Preparar dados para envio
        const data: NotifyMeData = {
          skuId: parseInt(productID),
          name: name.trim(),
          email: email.trim(),
          createdAt,
        };

        // Usar endpoint proxy no próprio site
        const response = await fetch("/api/notify-proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Erro ao enviar os dados.");
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

  return (
    <div class="notify-component">
      <form class="form-control justify-start gap-2" onSubmit={handleSubmit}>
        <span class="text-base text-['Lato'] text-[#3A4332]">
          Este produto está indisponivel no momento
        </span>
        <span class="text-sm text-['Lato'] text-[#3A4332]">
          Avise-me quando estiver disponivel
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
