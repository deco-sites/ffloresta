import { useState } from "preact/hooks";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

interface Props {
  navItems: SiteNavigationElement[];
}

const scrollbarStyles = `
  .scrollbar-custom::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .scrollbar-custom::-webkit-scrollbar-track {
    background: rgba(58, 67, 50, 0.3);
    border-radius: 4px;
  }

  .scrollbar-custom::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    border: 1px solid rgba(58, 67, 50, 0.2);
  }

  .scrollbar-custom::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.7);
  }

  .scrollbar-custom {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.5) rgba(58, 67, 50, 0.3);
  }
`;

export default function NavItemIsland({ navItems }: Props) {
  const [hoveredItem, setHoveredItem] = useState<SiteNavigationElement | null>(
    null,
  );
  const [hoveredSubItem, setHoveredSubItem] = useState<
    SiteNavigationElement | null
  >(null);

  return (
    <div
      class="relative"
      onMouseLeave={() => {
        setHoveredItem(null);
        setHoveredSubItem(null);
      }}
    >
      <style>{scrollbarStyles}</style>
      {/* Menu principal */}
      <ul class="flex gap-6 relative bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px]">
        <div class="container  flex items-center justify-between">
          {navItems.map((item) => (
            <li
              key={item.url}
              class="text-white px-4 cursor-pointer h-[50px] flex items-center hover:bg-[rgba(255,255,255,0.075)] transition-all duration-200 ease-in-out"
              onMouseEnter={() => setHoveredItem(item)}
            >
              <a href={item.url}>{item.name}</a>
            </li>
          ))}
        </div>
      </ul>

      {/* Submenu */}
      {hoveredItem?.children && (
        <div class="absolute left-2/4 transform -translate-x-2/4 z-40 container">
          <div class="flex items-start">
            <ul class="min-w-[243px] max-h-[430px] overflow-y-auto scrollbar-custom bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px]">
              {hoveredItem.children.map((child) => (
                <li
                  key={child.url}
                  class="text-white px-4 py-2 hover:bg-[rgba(255,255,255,0.075)] cursor-pointer transition-all duration-200 ease-in-out"
                  onMouseEnter={() => setHoveredSubItem(child)}
                >
                  <a href={child.url}>{child.name}</a>
                </li>
              ))}
            </ul>

            {/* Terceiro nível */}
            {hoveredSubItem?.children && (
              <ul class="min-w-[200px] w-full h-full bg-[rgba(14,20,15,0.6)] backdrop-blur-[12px] border-l border-white/10">
                {hoveredSubItem.children.map((third) => (
                  <li
                    key={third.url}
                    class="text-white px-4 py-2 hover:bg-[rgba(255,255,255,0.075)] cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    <a href={third.url}>{third.name}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
