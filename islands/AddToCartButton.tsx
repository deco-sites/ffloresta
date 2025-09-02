import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}

function AddToCartButton(props: Props) {
  const { product, item, seller, class: _class } = props;

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    event.stopImmediatePropagation();

    try {
      const platformProps = {
        allowedOutdatedData: ["paymentData"],
        orderItems: [{ quantity: 1, seller: seller, id: product.productID }],
      };

      if (window.STOREFRONT?.CART) {
        window.STOREFRONT.CART.addToCart(item, platformProps);
      }

      const minicartCheckbox = document.getElementById(
        "minicart-drawer",
      ) as HTMLInputElement | null;

      if (minicartCheckbox) {
        minicartCheckbox.checked = true;
        minicartCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  };

  return (
    <button
      class={_class}
      onClick={handleClick}
      data-hx-disable="true"
      _="on click halt the event"
    >
      COMPRAR
    </button>
  );
}

export default AddToCartButton;
