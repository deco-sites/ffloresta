import type { BreadcrumbList } from "apps/commerce/types.ts";
import { relative } from "../../sdk/url.ts";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
}

function Breadcrumb({ itemListElement = [] }: Props) {
  const items = [{ name: "Home", item: "/" }, ...itemListElement];

  return (
    <div class="breadcrumbs py-0 font-['Lato'] text-[14px] font-normal text-[#3A4332] overflow-hidden whitespace-nowrap">
      <ul class="flex flex-wrap items-center">
        {items
          .filter(({ name, item }) => name && item)
          .map(({ name, item }, index) => (
            <li
              key={index}
              class="flex items-center max-w-[calc(100vw-25px)] overflow-hidden text-ellipsis"
            >
              <a
                href={relative(item)}
                class="truncate max-w-[calc(100vw-25px)] overflow-hidden text-ellipsis"
              >
                {name}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Breadcrumb;
