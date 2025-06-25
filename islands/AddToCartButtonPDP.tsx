import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { clx } from "../sdk/clx.ts";
import { useId } from "../sdk/useId.ts";
import { usePlatform } from "../sdk/usePlatform.tsx";
import QuantitySelectorPDP from "../components/product/QuantitySelectorPDP.tsx";
import { useScript } from "@deco/deco/hooks";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}

const onClickAddToCart = () => {
  event?.stopPropagation();
  const button = event?.currentTarget as HTMLButtonElement | null;
  const container = button!.closest<HTMLDivElement>("div[data-cart-item]")!;
  const { item, platformProps } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item")!),
  );

  const input = container.querySelector(
    'input[type="number"]',
  ) as HTMLInputElement;
  const quantity = Number(input?.value ?? 1);

  item.quantity = quantity;
  if (platformProps?.orderItems?.[0]) {
    platformProps.orderItems[0].quantity = quantity;
  }

  window.STOREFRONT.CART.addToCart(item, platformProps);
};

const onClickBuyNow = () => {
  event?.stopPropagation();
  const button = event?.currentTarget as HTMLButtonElement | null;
  const container = button!.closest<HTMLDivElement>("div[data-cart-item]")!;
  const { item, platformProps } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item")!),
  );

  const input = container.querySelector(
    'input[type="number"]',
  ) as HTMLInputElement;
  const quantity = Number(input?.value ?? 1);

  item.quantity = quantity;
  if (platformProps?.orderItems?.[0]) {
    platformProps.orderItems[0].quantity = quantity;
  }

  window.STOREFRONT.CART.addToCart(item, platformProps);
  setTimeout(() => {
    window.location.href = "/checkout/#";
  }, 100);
};

const onChange = () => {
  const input = event!.currentTarget as HTMLInputElement;
  const productID = input!
    .closest("div[data-cart-item]")!
    .getAttribute("data-item-id")!;
  const quantity = Number(input.value);
  if (!input.validity.valid) {
    return;
  }
  window.STOREFRONT.CART.setQuantity(productID, quantity);
};

const useAddToCart = ({ product, seller }: Props) => {
  const platform = usePlatform();
  const { productID } = product;

  if (platform === "vtex") {
    return {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity: 1, seller: seller, id: productID }],
    };
  }

  return null;
};

function AddToCartButtonPDP(props: Props) {
  const { product, item, class: _class } = props;
  const platformProps = useAddToCart(props);
  const id = useId();

  return (
    <div
      id={id}
      class={clx("flex flex-col gap-4 w-full", _class?.toString())}
      data-item-id={product.productID}
      data-cart-item={encodeURIComponent(
        JSON.stringify({ item, platformProps }),
      )}
    >
      <QuantitySelectorPDP
        min={1}
        max={99}
        hx-on:change={useScript(onChange)}
      />

      <div class="flex gap-2">
        <button
          class="btn btn-primary flex-1"
          hx-on:click={useScript(onClickAddToCart)}
        >
          Adicionar ao Carrinho
        </button>

        <button
          class="btn btn-secondary flex-1"
          hx-on:click={useScript(onClickBuyNow)}
        >
          Comprar Agora
        </button>
      </div>
    </div>
  );
}

export default AddToCartButtonPDP;
