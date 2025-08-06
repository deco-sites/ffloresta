import { useSignal } from "@preact/signals";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

export interface Props {
  navItems?: SiteNavigationElement[];
}

const ArrowUp = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 15L12 9L6 15"
      stroke="#1F251C"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const ArrowDown = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="#1F251C"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const PlusGreen = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12H19M12 5V19"
      stroke="#1F251C"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const MinusGreen = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12H19"
      stroke="#1F251C"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

function ThirdLevelMenuItem({ item }: { item: SiteNavigationElement }) {
  const isOpen = useSignal(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li class="bg-white">
      <div class="flex justify-between items-center w-full px-4 py-2">
        <a href={item.url} class="text-[16px] hover:underline text-[#1F251C]">
          {item.name}
        </a>
        {hasChildren && (
          <button
            class="btn btn-ghost btn-xs px-0 flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isOpen.value = !isOpen.value;
            }}
          >
            {isOpen.value ? <MinusGreen /> : <PlusGreen />}
          </button>
        )}
      </div>
      {hasChildren && isOpen.value && (
        <ul class="bg-white">
          {item.children!.map((child) => (
            <li key={child.url} class="bg-white">
              <a
                href={child.url}
                class="block px-4 py-2 text-[16px] text-[#1F251C] hover:underline"
              >
                {child.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SubMenuItem({ item }: { item: SiteNavigationElement }) {
  const isOpen = useSignal(false);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <a
        href={item.url}
        class="block px-4 py-3 text-[16px] text-[#1F251C] bg-white"
      >
        {item.name}
      </a>
    );
  }

  return (
    <div class={`px-4 bg-white`}>
      <div class="flex justify-between items-center w-full">
        <a href={item.url} class="py-3 text-[16px] text-[#1F251C] flex-grow">
          {item.name}
        </a>
        <button
          class="btn btn-ghost btn-xs px-0 flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            isOpen.value = !isOpen.value;
          }}
        >
          {isOpen.value ? <MinusGreen /> : <PlusGreen />}
        </button>
      </div>
      {isOpen.value && (
        <div class="bg-white">
          <ul>
            {item.children!.map((child) => (
              <li key={child.url}>
                <ThirdLevelMenuItem item={child} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  const isOpen = useSignal(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div
      class={`group relative bg-white ${isOpen.value ? "bg-[#F1F1F1]" : ""}`}
    >
      <div class={`px-4 py-3 ${isOpen.value ? "bg-[#d1d1d1]" : ""}`}>
        <div class="flex justify-between items-center w-full">
          <a
            href={item.url}
            class={`text-[18px] font-bold text-[#1F251C] flex-grow`}
          >
            {item.name}
          </a>
          {hasChildren && (
            <button
              class="btn btn-ghost btn-xs px-0 flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                isOpen.value = !isOpen.value;
              }}
            >
              {isOpen.value ? <ArrowUp /> : <ArrowDown />}
            </button>
          )}
        </div>
      </div>
      {hasChildren && isOpen.value && (
        <div class="bg-white">
          <ul class="max-h-[calc(10*48px)] overflow-y-scroll pl-4">
            {item.children!.map((child) => (
              <li key={child.url}>
                <SubMenuItem item={child} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function MenuMobile({ navItems = [] }: Props) {
  return (
    <div class="flex flex-col min-h-screen w-full bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px]">
      <ul class="flex-grow flex flex-col p-4 pt-12 gap-4">
        {navItems.map((item) => (
          <li key={item.url}>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
