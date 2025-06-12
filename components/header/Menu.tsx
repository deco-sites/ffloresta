import Icon from "../../components/ui/Icon.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

export interface Props {
  navItems?: SiteNavigationElement[];
}

function SubMenuItem({ item }: { item: SiteNavigationElement }) {
  return (
    <div class="collapse collapse-plus rounded-none">
      <a
        href={item.url}
        class="py-3 font-[FS Emeric] font-normal text-[14px] leading-[100%] tracking-[0%]
       text-white bg-transparent cursor-pointer"
      >
        {item.name}
      </a>
    </div>
  );
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  return (
    <div class="collapse collapse-plus rounded-none">
      <input type="checkbox" class="peer" />
      <div class="
          collapse-title flex items-center 
          font-[FS Emeric] font-normal text-[16.87px] leading-[100%] tracking-[0%]
          text-[#1F251C] bg-transparent
          peer-checked:bg-[#3A4332] peer-checked:text-white
          transition-colors duration-300 cursor-pointer
        ">
        {item.name}
      </div>
      <div class="
          collapse-content
          bg-[linear-gradient(180deg,rgba(58,67,50,0.9)_0%,rgba(146,169,126,0.9)_100%)]
        ">
        <ul>
          <li>
            <a
              class="
                underline text-[12px] leading-[100%] text-white
                font-[FS Emeric] font-normal tracking-[0%]
              "
              href={item.url}
            >
              Ver todos
            </a>
          </li>
          {item.children?.map((node) => (
            <li>
              <SubMenuItem item={node} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Menu({ navItems = [] }: Props) {
  return (
    <div
      class="flex flex-col h-full overflow-y-auto"
      style={{ minWidth: "100vw" }}
    >
      <ul class="flex-grow flex flex-col divide-y divide-base-200 overflow-y-auto">
        {navItems.map((item) => (
          <li class="border-b-[1px solid #3A4332]">
            <MenuItem item={item} />
          </li>
        ))}
      </ul>

      {
        /* <ul class="flex flex-col py-2 bg-base-200">
        <li>
          <a class="flex items-center gap-4 px-4 py-2" href="/wishlist">
            <Icon id="favorite" />
            <span class="text-sm">Lista de desejos</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="home_pin" />
            <span class="text-sm">Nossas lojas</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="call" />
            <span class="text-sm">Fale conosco</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="account_circle" />
            <span class="text-sm">Minha conta</span>
          </a>
        </li>
      </ul> */
      }
    </div>
  );
}

export default Menu;
