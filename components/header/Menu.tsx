import { useRef } from "preact/hooks";
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
            class="py-2 font-['FS_Emeric'] text-[16px] text-white hover:underline block"
          >
            {thirdItem.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

function SubMenuItem({ item }: { item: SiteNavigationElement }) {
  const hasChildren = item.children && item.children.length > 0;
  const checkboxRef = useRef<HTMLInputElement>(null);

  if (!hasChildren) {
    return (
      <a
        href={item.url}
        class="block py-3 font-['FS_Emeric'] text-[16px] text-[#1F251C] hover:bg-[rgba(21,31,22,0.6)] hover:backdrop-blur-[12px] hover:text-white transition-all duration-200"
      >
        {item.name}
      </a>
    );
  }

  return (
    <div class="collapse rounded-none group">
      <input type="checkbox" ref={checkboxRef} class="peer" />
      <div class="collapse-title !p-0 !pr-4 group-hover:bg-[rgba(21,31,22,0.6)] group-hover:backdrop-blur-[12px]">
        <div class="flex justify-between items-center w-full">
          <a
            href={item.url}
            class="py-3 font-['FS_Emeric'] text-[16px] text-[#1F251C] peer-checked:text-white group-hover:text-white flex-grow"
          >
            {item.name}
          </a>
          <button
            class="btn btn-ghost btn-xs px-2 transition-transform duration-300 peer-checked:rotate-45"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (checkboxRef.current) {
                checkboxRef.current.checked = !checkboxRef.current.checked;
              }
            }}
          >
            <Icon
              id="Plus"
              size={16}
              class="text-[#1F251C] peer-checked:text-white group-hover:text-white"
            />
          </button>
        </div>
      </div>
      <div class="collapse-content !px-0">
        <ThirdLevelMenu items={item.children!} />
      </div>
    </div>
  );
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  const hasChildren = item.children && item.children.length > 0;
  const checkboxRef = useRef<HTMLInputElement>(null);

  return (
    <div class="collapse rounded-none border-b border-[#3A4332] group">
      <input type="checkbox" ref={checkboxRef} class="peer" />
      <div class="collapse-title !p-0 !pr-4 bg-white group-hover:bg-[rgba(21,31,22,0.6)] group-hover:backdrop-blur-[12px] peer-checked:bg-[rgba(21,31,22,0.6)] peer-checked:backdrop-blur-[12px]">
        <div class="flex justify-between items-center w-full">
          <a
            href={item.url}
            class="py-3 font-['FS_Emeric'] text-[16px] text-[#1F251C] peer-checked:text-white group-hover:text-white flex-grow"
          >
            {item.name}
          </a>
          {hasChildren && (
            <button
              class="btn btn-ghost btn-xs px-2 transition-transform duration-300 peer-checked:rotate-45"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (checkboxRef.current) {
                  checkboxRef.current.checked = !checkboxRef.current.checked;
                }
              }}
            >
              <Icon
                id="Plus"
                size={16}
                class="text-[#1F251C] peer-checked:text-white group-hover:text-white"
              />
            </button>
          )}
        </div>
      </div>
      {hasChildren && (
        <div class="collapse-content !px-0 bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px]">
          <ul>
            {item.children?.map((node, i) => (
              <li key={`${node.url}-${i}`}>
                <SubMenuItem item={node} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Menu({ navItems = [] }: Props) {
  return (
    <div class="flex flex-col h-full" style={{ minWidth: "100vw" }}>
      <ul class="flex-grow flex flex-col">
        {navItems.map((item) => (
          <li key={item.url} class="group">
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
