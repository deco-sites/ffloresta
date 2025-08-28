import { useState } from "preact/hooks";
import type { SKU } from "apps/vtex/utils/types.ts";

export interface Props {
  items: SKU[];
}

interface ShippingMethod {
  id: string;
  name: string;
  shippingEstimate: string;
  price: number;
}

interface SimulationItem {
  id: string;
  quantity: number;
  seller: string;
}

export default function ShippingForm({ items }: Props) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShippingMethod[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{0,3})/, "$1-$2");
    }

    setCep(value);
  };

  const formatShippingEstimate = (estimate: string) => {
    const [, time, type] = estimate.split(/(\d+)/);
    if (type === "bd") return `${time} dias úteis`;
    if (type === "d") return `${time} dias`;
    if (type === "h") return `${time} horas`;
    return estimate;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const calculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, "");

    if (!cleanCep || cleanCep.length !== 8) {
      setError("CEP inválido");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Prepara os itens para a simulação
      const simulationItems: SimulationItem[] = items.map((sku) => ({
        id: sku.id,
        quantity: sku.quantity ?? 1,
        seller: sku.seller ?? "1",
      }));

      // Faz o fetch direto para a API de checkout da VTEX
      const response = await fetch("/api/checkout/pub/orderForms/simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          items: simulationItems,
          postalCode: cleanCep,
          country: "BRA",
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erro na resposta:", response.status, errorData);
        throw new Error(`Erro ao calcular frete: ${response.status}`);
      }

      const data = await response.json();

      // Extrai os métodos de entrega
      const methods: ShippingMethod[] = [];

      if (data.logisticsInfo && Array.isArray(data.logisticsInfo)) {
        data.logisticsInfo.forEach((logisticInfo: any) => {
          if (logisticInfo.slas && Array.isArray(logisticInfo.slas)) {
            logisticInfo.slas.forEach((sla: any) => {
              methods.push({
                id: sla.id,
                name: sla.name,
                shippingEstimate: sla.shippingEstimate,
                price: sla.price,
              });
            });
          }
        });
      }

      console.log("Metodos de entrega:", methods);

      if (methods.length > 0) {
        setResults(methods);
      } else {
        setError("CEP inválido ou frete indisponível");
      }
    } catch (err) {
      console.error("Erro ao calcular frete:", err);
      setError("Erro ao calcular frete. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    calculateShipping();
  };

  return (
    <div class="flex flex-col">
      <form class="relative join gap-2 mb-2" onSubmit={handleSubmit}>
        <input
          type="text"
          class="w-full bg-[#D9D9D9] p-0 px-2 border-none outline-none"
          placeholder="00000-000"
          value={cep}
          maxLength={9}
          size={9}
          onInput={handleInput}
          disabled={loading}
        />
        <button
          type="submit"
          class="border-none outline-none bg-[#495941] min-w-[160px] h-8 py-1 px-3 text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[rgba(108,131,88,0.9)] disabled:opacity-50"
          disabled={loading || !cep}
        >
          {loading ? (
            <span class="loading loading-spinner loading-xs" />
          ) : (
            <span>CALCULAR FRETE</span>
          )}
        </button>
      </form>

      {/* Results */}
      {error && (
        <div class="p-2">
          <span class="text-red-600">{error}</span>
        </div>
      )}

      {results && results.length > 0 && (
        <ul class="flex flex-col gap-4 p-4 border border-base-400">
          {results.map((method) => (
            <li
              class="flex justify-between items-center border-base-200 not-first-child:border-t"
              key={method.id}
            >
              <span class="text-button text-center">{method.name}</span>
              <span class="text-button">
                até {formatShippingEstimate(method.shippingEstimate)}
              </span>
              <span class="text-base text-[#495941] font-semibold text-right uppercase">
                {method.price === 0
                  ? "Grátis"
                  : formatPrice(method.price / 100)}
              </span>
            </li>
          ))}
          <span class="text-xs font-light text-[#aeafae]">
            Os prazos de entrega começam a contar a partir da confirmação do
            pagamento e podem variar de acordo com a quantidade de produtos na
            sacola.
          </span>
        </ul>
      )}
    </div>
  );
}
