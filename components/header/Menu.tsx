import Icon from "../../components/ui/Icon.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

export interface Props {
  navItems?: SiteNavigationElement[];
}

function ThirdLevelMenu({ items }: { items: SiteNavigationElement[] }) {
  return (
    <ul class="pl-4">
      {items.map((thirdItem, i) => (
        <li key={`${thirdItem.url}-${i}`}>
          <a
            href={thirdItem.url}
            class="py-2 font-['FS_Emeric'] text-[13px] text-white hover:underline block"
          >
            {thirdItem.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

function SubMenuItem({ item }: { item: SiteNavigationElement }) {
  const hasThirdLevel = item.children && item.children.length > 0;

  return hasThirdLevel ? (
    <div class="collapse collapse-plus rounded-none">
      <input type="checkbox" class="peer" />
      <div class="collapse-title text-white text-[14px] font-['FS_Emeric'] px-0 py-3 min-h-[unset] h-fit">
        {item.name}
      </div>
      <div class="collapse-content bg-transparent">
        <ThirdLevelMenu items={item.children!} />
      </div>
    </div>
  ) : (
    <a
      href={item.url}
      class="block py-3 font-['FS_Emeric'] text-[14px] text-white bg-transparent"
    >
      {item.name}
    </a>
  );
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  return (
    <div class="collapse collapse-plus rounded-none">
      <input type="checkbox" class="peer" />
      <div class="collapse-title text-[#1F251C] peer-checked:bg-[#3A4332] peer-checked:text-white text-[16.87px] font-['FS_Emeric']">
        {item.name}
      </div>
      <div class="collapse-content bg-gradient-to-b from-[rgba(58,67,50,0.9)] to-[rgba(146,169,126,0.9)]">
        <ul>
          <li>
            <a
              class="underline text-[12px] text-white font-['FS_Emeric']"
              href={item.url}
            >
              Ver todos
            </a>
          </li>
          {item.children?.map((node, i) => (
            <li key={`${node.url}-${i}`}>
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
          <li key={item.url} class="border-b-[1px solid #3A4332]">
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
