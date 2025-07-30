import { useState } from "preact/hooks";
import { clx } from "../sdk/clx.ts";
import QuantitySelectorPDP from "../components/product/QuantitySelectorPDP.tsx";
import type { AnalyticsItem, Product } from "apps/commerce/types.ts";
import type { JSX } from "preact";
import { useId } from "../sdk/useId.ts";

export interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  platform: string; // Mantido como prop
}

export default function AddToCartButtonPDP({
  product,
  seller,
  item,
  platform,
  class: _class,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const id = useId();

  const getPlatformProps = () => {
    if (platform === "vtex") {
      return {
        allowedOutdatedData: ["paymentData"],
        orderItems: [{ quantity, seller, id: product.productID }],
      };
    }
    // Adicione outras plataformas conforme necessário
    return null;
  };

  const addToCart = (event: Event) => {
    event?.stopPropagation();
    const cartItem = { ...item, quantity };
    const platformProps = getPlatformProps();

    window.STOREFRONT.CART.addToCart(cartItem, platformProps);

    // Abre o minicart
    const minicartCheckbox = document.getElementById(
      "minicart-drawer", // ID do minicart
    ) as HTMLInputElement | null;
    if (minicartCheckbox) {
      minicartCheckbox.checked = true;
    }
  };

  const buyNow = (event: Event) => {
    addToCart(event);
  };

  return (
    <div class={clx("flex gap-[12px]", _class)}>
      <QuantitySelectorPDP
        min={1}
        max={99}
        value={quantity}
        onChange={setQuantity}
      />

      <div class="w-full flex items-center gap-2">
        <button
          onClick={buyNow}
          class="w-full min-h-8 flex items-center justify-center bg-[#05C100] text-white font-['FS_Emeric'] text-[16px] font-bold transition-all duration-300 hover:bg-[#2bbd48]"
        >
          COMPRAR
        </button>
      </div>
    </div>
  );
}
