import { useRef } from "preact/hooks";
import Icon from "../../components/ui/Icon.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

export interface Props {
  navItems?: SiteNavigationElement[];
}

function ThirdLevelMenu({ items }: { items: SiteNavigationElement[] }) {
  return (
    <ul class="px-4">
      {" "}
      {/* espaçamento lateral de 16px */}
      {items.map((thirdItem, i) => (
        <li key={`${thirdItem.url}-${i}`}>
          <a
            href={thirdItem.url}
            class="block py-2 font-['FS_Emeric'] text-[16px] text-[#1F251C] hover:underline group-hover:text-white peer-checked:text-white"
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
        class="block px-4 py-3 font-['FS_Emeric'] text-[16px] text-white transition-all duration-200"
      >
        {item.name}
      </a>
    );
  }

  return (
    <div class="collapse rounded-none group px-4 min-h-[0] border-none">
      {" "}
      {/* espaçamento lateral */}
      <input type="checkbox" ref={checkboxRef} class="peer min-h-[0] h-fit" />
      <div class="collapse-title !p-0 !pr-4 min-h-[0] h-fit">
        <div class="flex justify-between items-center w-full">
          <a
            href={item.url}
            class="py-3 font-['FS_Emeric'] text-[16px] text-white group-hover:text-white flex-grow"
          >
            {item.name}
          </a>
          <button
            class="btn btn-ghost btn-xs px-2 flex items-center justify-center"
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
              class="text-[#1F251C] group-hover:text-white peer-checked:hidden transition-colors"
            />
            <Icon
              id="Minus"
              size={16}
              class="hidden peer-checked:block text-white transition-colors"
            />
          </button>
        </div>
      </div>
      <div class="collapse-content !px-0 px-4 group-hover:text-white peer-checked:text-white">
        <ThirdLevelMenu items={item.children!} />
      </div>
    </div>
  );
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  const hasChildren = item.children && item.children.length > 0;
  const checkboxRef = useRef<HTMLInputElement>(null);

  return (
    <div class="collapse rounded-none group">
      {" "}
      {/* nivel 1 */}
      <input type="checkbox" ref={checkboxRef} class="peer px-4 min-h-[0]" />
      <div class="collapse-title !p-0 bg-white group-hover:bg-[rgba(21,31,22,0.6)] group-hover:backdrop-blur-[12px] peer-checked:bg-[rgba(21,31,22,0.6)] peer-checked:backdrop-blur-[12px] !px-4 min-h-[auto] border-none">
        <div class="flex justify-between items-center w-full">
          <a
            href={item.url}
            class="py-3 font-['FS_Emeric'] text-[16px] text-[#1F251C] peer-checked:text-white group-hover:text-white flex-grow"
          >
            {item.name}
          </a>
          {hasChildren && (
            <button
              class="btn btn-ghost btn-xs px-2 flex items-center justify-center"
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
                class="text-[#1F251C] group-hover:text-white peer-checked:hidden transition-colors"
              />
              <Icon
                id="Minus"
                size={16}
                class="hidden peer-checked:block text-white transition-colors"
              />
            </button>
          )}
        </div>
      </div>
      {hasChildren && (
        <div class="collapse-content !px-0 px-4 bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px] group-hover:text-white peer-checked:text-white">
          {/* mapear cada child, não repetir o mesmo nível */}
          <ul>
            {item.children!.map((child, idx) => (
              <li key={`${child.url}-${idx}`}>
                <SubMenuItem item={child} />
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
      <div class="h-full bg-white"></div>
    </div>
  );
}

export default Menu;
