import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { NAVBAR_HEIGHT_DESKTOP } from "../../constants.ts";

function NavItem({ item }: { item: SiteNavigationElement }) {
  const { url, name, children } = item;

  const hasChildWithImage = children?.some((child) => child.image?.length > 0);
  const childImage = children?.find((child) => child.image?.length > 0)
    ?.image?.[0];

  return (
    <li
      class="group relative flex items-center"
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <a
        href={url}
        class="h-[50px] flex items-center justify-center px-4 font-['FS_Emeric'] font-normal text-[16.87px] leading-[100%] text-[#1F251C] hover:text-white hover:bg-[#3A4332] transition-all duration-300"
      >
        {name}
      </a>

      {children && children.length > 0 && (
        <div
          class="absolute hidden hover:flex group-hover:flex z-40 items-start justify-center min-w-max bg-gradient-to-b from-[rgba(58,67,50,0.9)] to-[rgba(146,169,126,0.9)]"
          style={{
            top: "100%",
            left: 0,
          }}
        >
          <div class="flex container">
            <ul class="flex flex-col items-start justify-start p-5 gap-3 min-w-[243px]">
              {children.map((node) => (
                <li class="pl-0 py-1">
                  <a
                    class="hover:border-b hover:border-white font-['FS_Emeric'] font-normal text-[10.5px] leading-[100%] text-white transition-all duration-300 ease-in-out"
                    href={node.url}
                  >
                    <span>{node.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            {hasChildWithImage && childImage && (
              <Image
                class="ml-4"
                src={childImage.url}
                alt={name}
                loading="lazy"
              />
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default NavItem;
