import { AnalyticsItem } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import Icon from "../ui/Icon.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import { useScript } from "@deco/deco/hooks";
export type Item = AnalyticsItem & {
  listPrice: number;
  image: string;
};
export interface Props {
  item: Item;
  index: number;
  locale: string;
  currency: string;
}
const QUANTITY_MAX_VALUE = 300;
const removeItemHandler = () => {
  const itemID = (event?.currentTarget as HTMLButtonElement | null)
    ?.closest("fieldset")
    ?.getAttribute("data-item-id");
  if (typeof itemID === "string") {
    window.STOREFRONT.CART.setQuantity(itemID, 0);
  }
};
function CartItem({ item, index, locale, currency }: Props) {
  const { image, listPrice, price = Infinity, quantity } = item;
  const isGift = price < 0.01;
  // deno-lint-ignore no-explicit-any
  const name = (item as any).item_name;

  return (
    <fieldset
      data-item-id={(item as any).item_id}
      class="grid grid-rows-1 gap-4 items-start"
      style={{ gridTemplateColumns: "80px 1fr" }}
    >
      <Image
        alt={name}
        src={image}
        style={{ aspectRatio: "80 / 110" }}
        width={80}
        height={110}
        class="h-full object-contain"
      />

      {/* Info */}
      <div class="flex flex-col gap-3">
        {/* Name and Remove button */}
        <div class="flex justify-between items-start">
          <legend class="text-[#3A4332] text-[14px] leading-[137%] tracking-[0%]">
            {name}
          </legend>
          <button
            class={clx(
              isGift && "hidden",
              "btn btn-ghost btn-square no-animation p-0 hover:bg-transparent"
            )}
            hx-on:click={useScript(removeItemHandler)}
          >
            <Icon id="trash" size={24} class="text-[#6B7280]" />
          </button>
        </div>

        <div class="flex items-center justify-between">
          {/* Price Block */}
          <div class="flex items-center gap-2">
            {listPrice > price && (
              <span class="line-through text-[12px] text-[#6B7280]">
                {formatPrice(listPrice, currency, locale)}
              </span>
            )}
            <span class="text-[16px] font-bold leading-[170%] tracking-[3%] text-[#1F251C]">
              {isGift ? "Grátis" : formatPrice(price, currency, locale)}
            </span>
          </div>

          {/* Quantity Selector */}
          <div class={clx(isGift && "hidden", "mt-2")}>
            <QuantitySelector
              min={0}
              max={QUANTITY_MAX_VALUE}
              value={quantity}
              name={`item::${index}`}
              class="flex items-center justify-center text-center rounded-none h-[32px]"
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}

export default CartItem;
