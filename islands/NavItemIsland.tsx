import { useRef, useState } from "preact/hooks";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import { NAVBAR_HEIGHT_DESKTOP } from "../constants.ts";

// Configurações
const ITEM_HEIGHT = 40; // Altura aproximada de cada item em pixels
const VISIBLE_ITEMS = 8; // Número de itens visíveis antes do scroll

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

export default function NavItemIsland({
  item,
}: {
  item: SiteNavigationElement;
}) {
  const { url, name, children } = item;
  const submenuRef = useRef<HTMLDivElement>(null);
  const thirdLevelRef = useRef<HTMLDivElement>(null);
  const [submenuTransform, setSubmenuTransform] = useState("translateX(0)");
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);
  const [activeThirdLevel, setActiveThirdLevel] = useState<{
    items: SiteNavigationElement[];
    topPosition: number;
  } | null>(null);

  // Calcula a altura máxima baseada no número de itens
  const calculateMaxHeight = (items: SiteNavigationElement[]) => {
    const itemCount = items.length;
    return itemCount > VISIBLE_ITEMS
      ? `${VISIBLE_ITEMS * ITEM_HEIGHT}px`
      : `${itemCount * ITEM_HEIGHT}px`;
  };

  const adjustPosition = () => {
    const node = submenuRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const overflowRight = rect.right - window.innerWidth;
    const overflowLeft = rect.left;

    if (overflowRight > 0) {
      setSubmenuTransform(`translateX(-${overflowRight + 16}px)`);
    } else if (overflowLeft < 0) {
      setSubmenuTransform(`translateX(${Math.abs(overflowLeft) + 16}px)`);
    } else {
      setSubmenuTransform("translateX(0)");
    }
  };

  const handleSubItemHover = (
    items: SiteNavigationElement[] | undefined,
    event: MouseEvent
  ) => {
    if (!items || items.length === 0) {
      setActiveThirdLevel(null);
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const parentRect = submenuRef.current?.getBoundingClientRect();

    if (parentRect) {
      setActiveThirdLevel({
        items,
        topPosition: rect.top - parentRect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    adjustPosition();
    setIsSubmenuVisible(true);
  };

  const handleMouseLeave = (e: MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (
      !submenuRef.current?.contains(relatedTarget) &&
      !thirdLevelRef.current?.contains(relatedTarget)
    ) {
      setIsSubmenuVisible(false);
      setActiveThirdLevel(null);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />

      <li
        class="group relative flex items-center"
        style={{ height: NAVBAR_HEIGHT_DESKTOP }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a
          href={url}
          class="h-[50px] flex items-center justify-center px-4 font-['FS_Emeric'] text-[16.87px] text-[#1F251C] hover:text-white hover:bg-[#3A4332] transition-all duration-300 max-[1300px]:text-[14px] max-[1300px]:px-3"
        >
          {name}
        </a>

        {children && children.length > 0 && (
          <div
            ref={submenuRef}
            class={`absolute hidden ${
              isSubmenuVisible ? "!flex" : ""
            } z-40 bg-gradient-to-b from-[rgba(58,67,50,0.9)] to-[rgba(146,169,126,0.9)] transition-transform duration-300 overflow-y-auto scrollbar-custom`}
            style={{
              top: "100%",
              left: 0,
              transform: submenuTransform,
              maxHeight: calculateMaxHeight(children),
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div class="flex">
              <ul class="flex flex-col min-w-[243px]">
                {children.map((node, i) => (
                  <li
                    key={`${node.url}-${i}`}
                    class="relative"
                    onMouseEnter={(e) => handleSubItemHover(node.children, e)}
                  >
                    <a
                      class="hover:underline font-['FS_Emeric'] text-[14px] text-white block p-2 px-[22px]"
                      href={node.url}
                    >
                      {node.name}
                    </a>
                  </li>
                ))}
              </ul>

              {activeThirdLevel && (
                <div
                  ref={thirdLevelRef}
                  class="flex flex-col min-w-[200px] shadow-lg overflow-y-auto scrollbar-custom"
                  style={{
                    maxHeight: calculateMaxHeight(activeThirdLevel.items),
                  }}
                  onMouseEnter={() => setIsSubmenuVisible(true)}
                  onMouseLeave={handleMouseLeave}
                >
                  {activeThirdLevel.items.map((child, i) => (
                    <a
                      key={`${child.url}-${i}`}
                      class="text-white font-['FS_Emeric'] text-[12px] hover:underline p-2 px-[16px]"
                      href={child.url}
                    >
                      {child.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </li>
    </>
  );
}
