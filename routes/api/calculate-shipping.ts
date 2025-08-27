import { AppContext } from "apps/vtex/mod.ts";
import type { SimulationOrderForm, Sla } from "apps/vtex/utils/types.ts";
import { formatPrice } from "../../sdk/format.ts";

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);
  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
  return estimate;
};

export default async function (req: Request, ctx: AppContext) {
  try {
    const form = await req.formData();
    const postalCode = `${form.get("postalCode") ?? ""}`.replace(/\D/g, "");
    const itemsData = form.get("items");

    if (!itemsData) {
      return new Response(
        `<div class="p-2"><span>Items não encontrados</span></div>`,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    const items = JSON.parse(itemsData as string);

    if (!postalCode || postalCode.length !== 8) {
      return new Response(`<div class="p-2"><span>CEP inválido</span></div>`, {
        headers: { "Content-Type": "text/html" },
      });
    }

    const result = (await ctx.invoke("vtex/actions/cart/simulation.ts", {
      items: items.map((sku: any) => ({
        id: sku.id,
        quantity: sku.quantity ?? 1,
        seller: sku.seller ?? "1",
      })),
      postalCode,
      country: "BRA",
    })) as SimulationOrderForm | null;

    const methods =
      result?.logisticsInfo?.reduce(
        (initial, { slas }) => [...initial, ...slas],
        [] as Sla[]
      ) ?? [];

    if (!methods.length) {
      return new Response(
        `<div class="p-2"><span>CEP inválido ou frete indisponível</span></div>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    const html = `
      <ul class="flex flex-col gap-4 p-4 border border-base-400">
        ${methods
          .map(
            (method) => `
          <li class="flex justify-between items-center border-base-200 not-first-child:border-t" key="${
            method.id
          }">
            <span class="text-button text-center">${method.name}</span>
            <span class="text-button">
              até ${formatShippingEstimate(method.shippingEstimate)}
            </span>
            <span class="text-base text-[#495941] font-semibold text-right uppercase">
              ${
                method.price === 0
                  ? "Grátis"
                  : formatPrice(method.price / 100, "BRL", "pt-BR")
              }
            </span>
          </li>
        `
          )
          .join("")}
        <span class="text-xs font-light text-[#aeafae]">
          Os prazos de entrega começam a contar a partir da confirmação do
          pagamento e podem variar de acordo com a quantidade de produtos na
          sacola.
        </span>
      </ul>
    `;

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  } catch (err) {
    console.error("Erro na simulação de frete:", err);
    return new Response(
      `<div class="p-2"><span>Erro ao calcular frete. Tente novamente.</span></div>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
