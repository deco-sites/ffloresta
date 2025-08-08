import type { Product } from "apps/commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import { useComponent } from "../../sections/Component.tsx";

export interface Props {
  productID: Product["productID"];
}

export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const form = await req.formData();

  const name = `${form.get("name") ?? ""}`;
  const email = `${form.get("email") ?? ""}`;

  // deno-lint-ignore no-explicit-any
  await (ctx as any).invoke("vtex/actions/notifyme.ts", {
    skuId: props.productID,
    name,
    email,
  });

  return props;
};

export default function Notify({ productID }: Props) {
  return (
    <form
      class="form-control justify-start gap-2"
      hx-sync="this:replace"
      hx-indicator="this"
      hx-swap="none"
      hx-post={useComponent<Props>(import.meta.url, { productID })}
    >
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
      />
      <input
        placeholder="Email"
        class="input input-bordered rounded-none bg-[#D9D9D9] border-none min-h-0 h-8 py-0 px-3 text-['Lato'] placeholder:text-sm focus:outline-none focus-within:outline-none outline-none"
        name="email"
      />

      <button class="btn btn-primary no-animation rounded-none min-h-0 h-8 bg-[#3A4332] hover:bg-[#0f130e] border-none text-['Lato']">
        <span class="[.htmx-request_&]:hidden inline ">Enviar</span>
        <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
      </button>
    </form>
  );
}
