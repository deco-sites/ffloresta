import { AppContext } from "../../apps/site.ts";
import { MINICART_DRAWER_ID, MINICART_FORM_ID } from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useComponent } from "../../sections/Component.tsx";
import Coupon from "./Coupon.tsx";
import FreeShippingProgressBar from "./FreeShippingProgressBar.tsx";
import CartItem, { Item } from "./Item.tsx";
import { useScript } from "@deco/deco/hooks";
export interface Minicart {
  /** Cart from the ecommerce platform */
  platformCart: Record<string, unknown>;
  /** Cart from storefront. This can be changed at your will */
  storefront: {
    items: Item[];
    total: number;
    subtotal: number;
    discounts: number;
    coupon?: string;
    locale: string;
    currency: string;
    enableCoupon?: boolean;
    freeShippingTarget: number;
    checkoutHref: string;
  };
}
const onLoad = (formID: string) => {
  const form = document.getElementById(formID) as HTMLFormElement;
  window.STOREFRONT.CART.dispatch(form);
  // view_cart event
  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver((items, observer) => {
      for (const item of items) {
        if (item.isIntersecting && item.target === form) {
          window.DECO.events.dispatch({
            name: "view_cart",
            params: window.STOREFRONT.CART.getCart(),
          });
          observer?.unobserve(item.target);
        }
      }
    }).observe(form);
  }
  // Disable form interactivity while cart is being submitted
  document.body.addEventListener(
    "htmx:before-send", // deno-lint-ignore no-explicit-any
    ({ detail: { elt } }: any) => {
      if (elt !== form) {
        return;
      }
      // Disable addToCart button interactivity
      document.querySelectorAll("div[data-cart-item]").forEach((container) => {
        container
          ?.querySelectorAll("button")
          .forEach((node) => (node.disabled = true));
        container
          ?.querySelectorAll("input")
          .forEach((node) => (node.disabled = true));
      });
    }
  );
};
const sendBeginCheckoutEvent = () => {
  window.DECO.events.dispatch({
    name: "being_checkout",
    params: window.STOREFRONT.CART.getCart(),
  });
};
export const action = async (_props: unknown, req: Request, ctx: AppContext) =>
  req.method === "PATCH"
    ? { cart: await ctx.invoke("site/loaders/minicart.ts") } // error fallback
    : { cart: await ctx.invoke("site/actions/minicart/submit.ts") };
export function ErrorFallback() {
  return (
    <div class="flex flex-col flex-grow justify-center items-center overflow-hidden w-full gap-2">
      <div class="flex flex-col gap-1 p-6 justify-center items-center">
        <span class="font-semibold">Error while updating cart</span>
        <span class="text-sm text-center">
          Click in the button below to retry or refresh the page
        </span>
      </div>

      <button
        class="btn btn-primary"
        hx-patch={useComponent(import.meta.url)}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        Retry
      </button>
    </div>
  );
}
export default function Cart({
  cart: {
    platformCart,
    storefront: {
      items,
      total,
      subtotal,
      coupon,
      discounts,
      locale,
      currency,
      enableCoupon = true,
      freeShippingTarget,
      checkoutHref,
    },
  },
}: {
  cart: Minicart;
}) {
  const count = items.length;
  return (
    <>
      <form
        class="contents"
        id={MINICART_FORM_ID}
        hx-sync="this:replace"
        hx-trigger="submit, change delay:300ms"
        hx-target="this"
        hx-indicator="this"
        hx-disabled-elt="this"
        hx-post={useComponent(import.meta.url)}
        hx-swap="outerHTML"
      >
        {/* Button to submit the form */}
        <button hidden autofocus />

        {/* Add to cart controllers */}
        <input name="add-to-cart" type="hidden" />
        <button hidden name="action" value="add-to-cart" />

        {/* This contains the STOREFRONT cart. */}
        <input
          type="hidden"
          name="storefront-cart"
          value={encodeURIComponent(
            JSON.stringify({ coupon, currency, value: total, items })
          )}
        />

        {/* This contains the platformCart cart from the commerce platform. */}
        <input
          type="hidden"
          name="platform-cart"
          value={encodeURIComponent(JSON.stringify(platformCart))}
        />

        <div
          class={clx(
            "flex flex-col flex-grow justify-center items-center overflow-hidden w-full",
            "[.htmx-request_&]:pointer-events-none [.htmx-request_&]:opacity-60 [.htmx-request_&]:cursor-wait transition-opacity duration-300"
          )}
        >
          {count === 0 ? (
            <div class="flex flex-col gap-6 items-center justify-center h-full">
              <span class="font-['FS_Emeric'] font-normal text-[16px] text-[#1F251C]">
                Your bag is empty
              </span>
              <label
                for={MINICART_DRAWER_ID}
                class="btn no-animation bg-[#3A4332] text-white hover:bg-[#3A4332] hover:text-white border-none font-['FS_Emeric'] font-normal text-[16px] px-6 py-3"
              >
                Choose products
              </label>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ul
                role="list"
                class="mt-6 px-4 flex-grow overflow-y-auto flex flex-col gap-8 w-full"
              >
                {items.map((item, index) => (
                  <li>
                    <CartItem
                      item={item}
                      index={index}
                      locale={locale}
                      currency={currency}
                    />
                  </li>
                ))}
              </ul>

              {/* Free Shipping Bar */}
              <div class="px-4 py-6 w-full bg-[#F5F5F5]">
                <FreeShippingProgressBar
                  total={total}
                  locale={locale}
                  currency={currency}
                  target={freeShippingTarget}
                />
              </div>

              {/* Cart Footer */}
              <footer class="w-full bg-white">
                {/* Subtotal */}
                <div class="border-t border-[#E5E5E5] py-4 flex flex-col gap-2">
                  {discounts > 0 && (
                    <div class="flex justify-between items-center px-4">
                      <span class="font-['FS_Emeric'] text-[14px] text-[#1F251C]">
                        Descontos
                      </span>
                      <span class="font-['FS_Emeric'] text-[14px] text-[#1F251C]">
                        {formatPrice(discounts, currency, locale)}
                      </span>
                    </div>
                  )}
                  <div class="w-full flex justify-between px-4">
                    <span class="font-['FS_Emeric'] text-[14px] text-[#1F251C]">
                      Subtotal
                    </span>
                    <output
                      form={MINICART_FORM_ID}
                      class="font-['FS_Emeric'] text-[14px] text-[#1F251C]"
                    >
                      {formatPrice(subtotal, currency, locale)}
                    </output>
                  </div>
                  {enableCoupon && <Coupon coupon={coupon} />}
                </div>

                {/* Total */}
                <div class="border-t border-[#E5E5E5] pt-4 pb-6 flex flex-col justify-end items-end gap-2 px-4">
                  <div class="flex justify-between items-center w-full">
                    <span class="font-['FS_Emeric'] text-[16px] leading-[170%] tracking-[3%]">
                      Total
                    </span>
                    <output
                      form={MINICART_FORM_ID}
                      class="font-['FS_Emeric'] font-bold text-[16px] leading-[170%] tracking-[3%] text-[#1F251C]"
                    >
                      {formatPrice(total, currency, locale)}
                    </output>
                  </div>
                  <span class="font-['FS_Emeric'] text-[12px] text-[#6B7280]">
                    Frete e taxas serão calculados na próxima etapa.
                  </span>
                </div>

                <div class="px-4 pb-8">
                  <a
                    class="btn w-full no-animation bg-[#05C100] text-white hover:bg-[#3A4332] hover:text-white border-none font-['FS_Emeric'] font-normal text-[16px] h-[50px]"
                    href={checkoutHref}
                    hx-on:click={useScript(sendBeginCheckoutEvent)}
                  >
                    <span class="[.htmx-request_&]:hidden">COMPRAR AGORA</span>
                    <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
                  </a>
                </div>
              </footer>
            </>
          )}
        </div>
      </form>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, MINICART_FORM_ID),
        }}
      />
    </>
  );
}
