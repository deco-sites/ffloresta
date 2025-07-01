// /islands/AddToCartButtonPDP.tsx
import { useState } from "preact/hooks";
import { clx } from "../sdk/clx.ts";
import QuantitySelectorPDP from "../components/product/QuantitySelectorPDP.tsx";
import type { AnalyticsItem, Product } from "apps/commerce/types.ts";
import type { JSX } from "preact";

export interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  platform: string; // Agora vem do componente pai
}

export default function AddToCartButtonPDP({
  product,
  seller,
  item,
  platform,
  class: _class,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  const platformProps = platform === "vtex"
    ? {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity, seller, id: product.productID }],
    }
    : null;

  const addToCart = () => {
    const cartItem = { ...item, quantity };
    const props = platformProps && {
      ...platformProps,
      orderItems: [{ ...platformProps.orderItems[0], quantity }],
    };

    window.STOREFRONT.CART.addToCart(cartItem, props);
  };

  const buyNow = () => {
    addToCart();
    setTimeout(() => {
      window.location.href = "/checkout/#";
    }, 100);
  };

  return (
    <div class={clx("flex gap-[6px]", _class)}>
      <QuantitySelectorPDP
        min={1}
        max={99}
        value={quantity}
        onChange={setQuantity}
      />

      <div class="w-full  flex items-center gap-2">
        <button
          onClick={buyNow}
          class="w-full min-h-8 flex items-center justify-center bg-[#2DDC4F] text-white font-['FS_Emeric'] text-[13px] font-bold transition-all duration-300 hover:bg-[#2bbd48]"
        >
          COMPRAR
        </button>
        <span class="hidden lg:block font-['FS_Emeric'] text-[9px]">ou</span>
        <button
          onClick={addToCart}
          class="hidden w-full min-w-[178px] min-h-8 lg:flex items-center justify-center bg-[#9AA37C] font-['FS_Emeric'] text-[13px] font-bold transition-all duration-300 hover:bg-[#7f8863]"
        >
          ADICIONAR AO CARRINHO
        </button>
      </div>
    </div>
  );
}
