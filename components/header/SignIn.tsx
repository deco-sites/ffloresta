import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";

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

function SignIn({ variant }: { variant: "mobile" | "desktop" }) {
  const id = useId();
  return (
    <div id={id}>
      <a
        class={clx(
          "flex items-center justify-center font-['FS_Emeric'] font-normal text-[16.87px] leading-none text-white uppercase",
          variant === "mobile" ? "gap-3.5" : "gap-[14px]",
        )}
        href="/login"
        aria-label="Login"
      >
        <svg
          width="21"
          height="23"
          viewBox="0 0 21 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="9.93851"
            cy="7.22546"
            r="5.62225"
            stroke="white"
            stroke-width="1.40556"
          />
          <path
            d="M0.802345 21.9839C1.03661 19.6413 3.1918 14.9561 9.93851 14.9561C16.6852 14.9561 19.3089 19.6413 19.7775 21.9839"
            stroke="white"
            stroke-width="1.40556"
          />
        </svg>

        {variant === "desktop" && <span>FAZER LOGIN</span>}
      </a>
      <a
        class={clx(
          "hidden flex items-center justify-center font-['FS_Emeric'] font-normal text-[16.87px] leading-none text-white uppercase",
          variant === "mobile" ? "gap-3.5" : "gap-[14px]",
        )}
        href="/account"
        aria-label="Account"
      >
        <svg
          width="21"
          height="23"
          viewBox="0 0 21 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="9.93851"
            cy="7.22546"
            r="5.62225"
            stroke="white"
            stroke-width="1.40556"
          />
          <path
            d="M0.802345 21.9839C1.03661 19.6413 3.1918 14.9561 9.93851 14.9561C16.6852 14.9561 19.3089 19.6413 19.7775 21.9839"
            stroke="white"
            stroke-width="1.40556"
          />
        </svg>

        {variant === "desktop" && <span>MINHA CONTA</span>}
      </a>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}

export default SignIn;
