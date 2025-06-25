// /islands/AddToCartButtonPDP.tsx
import { useState } from "preact/hooks";
import { clx } from "../sdk/clx.ts";
import QuantitySelectorPDP from "../components/product/QuantitySelectorPDP.tsx";
import type { Product, AnalyticsItem } from "apps/commerce/types.ts";
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

  const platformProps =
    platform === "vtex"
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
    <div class={clx("flex gap-4", _class)}>
      <QuantitySelectorPDP
        min={1}
        max={99}
        value={quantity}
        onChange={setQuantity}
      />

      <div class="flex gap-2">
        <button onClick={addToCart} class="btn btn-primary flex-1">
          Adicionar ao Carrinho
        </button>
        <button onClick={buyNow} class="btn btn-secondary flex-1">
          Comprar Agora
        </button>
      </div>
    </div>
  );
}
