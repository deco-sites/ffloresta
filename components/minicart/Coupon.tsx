import { MINICART_FORM_ID } from "../../constants.ts";
import { useScript } from "@deco/deco/hooks";
export interface Props {
  coupon?: string;
}
function Coupon({ coupon }: Props) {
  return (
    <div class="flex justify-between items-center px-4">
      <span class="text-sm">Cupom de Desconto</span>

      <button
        type="button"
        class="underline font-normal cursor-pointer"
        hx-on:click={useScript(() => {
          event?.stopPropagation();
          const button = event?.currentTarget as HTMLButtonElement;
          button.classList.add("hidden");
          button.nextElementSibling?.classList.remove("hidden");
        })}
      >
        {coupon || "Inserir"}
      </button>

      {/* Displayed when checkbox is checked=true */}
      <div class="join hidden">
        <input
          form={MINICART_FORM_ID}
          name="coupon"
          class=""
          type="text"
          value={coupon ?? ""}
          placeholder={"Cupom"}
        />
        <button
          form={MINICART_FORM_ID}
          class=""
          name="action"
          value="set-coupon"
        >
          Ok
        </button>
      </div>
    </div>
  );
}
export default Coupon;
