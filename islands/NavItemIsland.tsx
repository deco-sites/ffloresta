import { useRef, useState } from "preact/hooks";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import { NAVBAR_HEIGHT_DESKTOP } from "../constants.ts";

export default function NavItemIsland({
  item,
}: {
  item: SiteNavigationElement;
}) {
  const { url, name, children } = item;
  const submenuRef = useRef<HTMLDivElement>(null);
  const [submenuTransform, setSubmenuTransform] = useState("translateX(0)");
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);
  const [activeThirdLevel, setActiveThirdLevel] = useState<{
    items: SiteNavigationElement[];
    topPosition: number;
  } | null>(null);

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

  return (
    <li
      class="group relative flex items-center"
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
      onMouseEnter={adjustPosition}
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
          class={`absolute hidden group-hover:flex ${
            isSubmenuHovered ? "flex" : ""
          } z-40 bg-gradient-to-b from-[rgba(58,67,50,0.9)] to-[rgba(146,169,126,0.9)] transition-transform duration-300`}
          style={{ top: "100%", left: 0, transform: submenuTransform }}
          onMouseEnter={() => setIsSubmenuHovered(true)}
          onMouseLeave={() => {
            setIsSubmenuHovered(false);
            setActiveThirdLevel(null);
          }}
        >
          <div class="flex">
            {/* Primeiro nível de submenu */}
            <ul class="flex flex-col min-w-[243px]">
              {children.map((node, i) => (
                <li
                  key={`${node.url}-${i}`}
                  class="relative"
                  onMouseEnter={(e) => handleSubItemHover(node.children, e)}
                  onMouseLeave={() => setActiveThirdLevel(null)}
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

            {/* Container para o terceiro nível */}
            {activeThirdLevel && (
              <div
                class="flex flex-col min-w-[200px] bg-white shadow-lg"
                style={{ marginTop: `${activeThirdLevel.topPosition}px` }}
              >
                {activeThirdLevel.items.map((child, i) => (
                  <a
                    key={`${child.url}-${i}`}
                    class="text-[#1F251C] font-['FS_Emeric'] text-[12px] hover:underline p-2 px-[16px]"
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
  );
}
