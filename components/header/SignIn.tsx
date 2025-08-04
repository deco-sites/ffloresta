import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";

// Tamanhos e estilos padronizados
const ICON_SIZE = 20;
const TEXT_STYLE = "font-['Lato'] font-normal text-[14px] leading-none";
const TEXT_COLOR = "text-[#1F251C] lg:text-white";
const GAP = "gap-3.5 lg:gap-[14px]";

const onLoad = (containerID: string) => {
  window.STOREFRONT.USER.subscribe((sdk) => {
    const container = document.getElementById(containerID) as HTMLDivElement;
    const nodes = container.querySelectorAll<HTMLAnchorElement>("a");
    const login = nodes.item(0);
    const account = nodes.item(1);
    const user = sdk.getUser();
    if (user?.email) {
      login.classList.add("hidden");
      account.classList.remove("hidden");
    } else {
      login.classList.remove("hidden");
      account.classList.add("hidden");
    }
  });
};

interface Props {
  variant: "mobile" | "desktop";
  showText?: boolean;
}

function SignIn({ variant, showText = true }: Props) {
  const id = useId();

  return (
    <div id={id}>
      {/* Login */}
      <a
        class={clx(
          "flex items-center justify-center",
          TEXT_STYLE,
          TEXT_COLOR,
          GAP
        )}
        href="/login"
        aria-label="Login"
      >
        <svg
          width={ICON_SIZE}
          height={ICON_SIZE}
          viewBox="0 0 21 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="9.93851"
            cy="7.22546"
            r="5.62225"
            stroke={variant === "mobile" ? "#1F251C" : "white"}
            stroke-width="1.40556"
          />
          <path
            d="M0.802345 21.9839C1.03661 19.6413 3.1918 14.9561 9.93851 14.9561C16.6852 14.9561 19.3089 19.6413 19.7775 21.9839"
            stroke={variant === "mobile" ? "#1F251C" : "white"}
            stroke-width="1.40556"
          />
        </svg>
        {showText && <span>Fazer Login</span>}
      </a>

      {/* Minha Conta */}
      <a
        class={clx(
          "hidden flex items-center justify-center",
          TEXT_STYLE,
          TEXT_COLOR,
          GAP
        )}
        href="/account"
        aria-label="Account"
      >
        <svg
          width={ICON_SIZE}
          height={ICON_SIZE}
          viewBox="0 0 21 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="9.93851"
            cy="7.22546"
            r="5.62225"
            stroke={variant === "mobile" ? "#1F251C" : "white"}
            stroke-width="1.40556"
          />
          <path
            d="M0.802345 21.9839C1.03661 19.6413 3.1918 14.9561 9.93851 14.9561C16.6852 14.9561 19.3089 19.6413 19.7775 21.9839"
            stroke={variant === "mobile" ? "#1F251C" : "white"}
            stroke-width="1.40556"
          />
        </svg>
        {showText && <span>Minha Conta</span>}
      </a>

      {/* Script de comportamento login/account */}
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}

export default SignIn;
