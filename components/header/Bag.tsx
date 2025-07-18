import { clx } from "../../sdk/clx.ts";
import { MINICART_DRAWER_ID } from "../../constants.ts";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";

// Usando as mesmas constantes de estilo
const ICON_SIZE = 20;
const TEXT_STYLE = "font-['FS_Emeric'] font-normal text-[14px] leading-none";
const TEXT_COLOR = "text-white";
const GAP = "gap-3.5 lg:gap-[14px]";

const onLoad = (id: string) =>
  window.STOREFRONT.CART.subscribe((sdk) => {
    const counter = document.getElementById(id);
    const count = sdk.getCart()?.items.length ?? 0;
    if (!counter) {
      return;
    }
    if (count === 0) {
      counter.classList.add("hidden");
    } else {
      counter.classList.remove("hidden");
    }
    counter.innerText = count > 9 ? "9+" : count.toString();
  });

function Bag() {
  const id = useId();
  return (
    <>
      <label class="indicator" for={MINICART_DRAWER_ID} aria-label="open cart">
        <span
          id={id}
          class="hidden indicator-item badge badge-primary badge-sm font-thin bg-[#23ac6a] text-white outline-none border-none"
        />

        <span class={clx("flex items-center cursor-pointer", TEXT_COLOR, GAP)}>
          <svg
            width={ICON_SIZE}
            height={ICON_SIZE}
            viewBox="0 0 21 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5813 1.30603H5.1591L7.55622 12.9568C7.63801 13.3574 7.86204 13.7173 8.18909 13.9734C8.51613 14.2295 8.92535 14.3655 9.34512 14.3577H18.0392C18.4589 14.3655 18.8682 14.2295 19.1952 13.9734C19.5223 13.7173 19.7463 13.3574 19.8281 12.9568L21.2592 5.65658H6.05355M19.4703 18.7082C19.4703 18.939 19.3761 19.1603 19.2083 19.3235C19.0406 19.4867 18.8131 19.5784 18.5758 19.5784C18.3386 19.5784 18.1111 19.4867 17.9434 19.3235C17.7756 19.1603 17.6814 18.939 17.6814 18.7082C17.6814 18.4775 17.7756 18.2562 17.9434 18.093C18.1111 17.9298 18.3386 17.8381 18.5758 17.8381C18.8131 17.8381 19.0406 17.9298 19.2083 18.093C19.3761 18.2562 19.4703 18.4775 19.4703 18.7082ZM9.63135 18.7082C9.63135 18.939 9.53711 19.1603 9.36937 19.3235C9.20162 19.4867 8.97412 19.5784 8.7369 19.5784C8.49967 19.5784 8.27217 19.4867 8.10442 19.3235C7.93668 19.1603 7.84245 18.939 7.84245 18.7082C7.84245 18.4775 7.93668 18.2562 8.10442 18.093C8.27217 17.9298 8.49967 17.8381 8.7369 17.8381C8.97412 17.8381 9.20162 17.9298 9.36937 18.093C9.53711 18.2562 9.63135 18.4775 9.63135 18.7082Z"
              stroke="currentColor"
              stroke-width="1.40556"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class={clx(TEXT_STYLE, "hidden md:block")}>Carrinho</span>
        </span>
      </label>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </>
  );
}

export default Bag;
