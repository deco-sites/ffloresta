import { useSignal } from "@preact/signals";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

export interface Props {
  navItems?: SiteNavigationElement[];
}

const PlusWhite = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12H19M12 5V19"
      stroke="white"
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

const MinusWhite = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12H19"
      stroke="white"
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
    <li class="group">
      <div class="flex justify-between items-center w-full">
        <a
          href={item.url}
          class="py-2 font-['Lato'] text-[16px] hover:underline text-white"
        >
          {item.name}
        </a>
        {hasChildren && (
          <button
            class="btn btn-ghost btn-xs px-2 flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isOpen.value = !isOpen.value;
            }}
          >
            {isOpen.value ? <MinusWhite /> : <PlusGreen />}
          </button>
        )}
      </div>
      {hasChildren && isOpen.value && (
        <ul class="px-4">
          {item.children!.map((child) => (
            <li key={child.url}>
              <a
                href={child.url}
                class="block py-2 font-['Lato'] text-[16px] text-[#1F251C] hover:underline group-hover:text-white"
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
        class="block px-4 py-3 font-['Lato'] text-[16px] text-white transition-all duration-200"
      >
        {item.name}
      </a>
    );
  }

  return (
    <div class="group px-4 min-h-[0] border-none">
      <div class="flex justify-between items-center w-full">
        <a
          href={item.url}
          class="py-3 font-['Lato'] text-[16px] text-white group-hover:text-white flex-grow"
        >
          {item.name}
        </a>
        <button
          class="btn btn-ghost btn-xs px-2 flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            isOpen.value = !isOpen.value;
          }}
        >
          {isOpen.value ? <MinusWhite /> : <PlusWhite />}
        </button>
      </div>
      {isOpen.value && (
        <div class="px-4 group-hover:text-white">
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
    <div class="group relative">
      <div
        class={`collapse-title !p-0  group-hover:bg-[rgba(21,31,22,0.6)] group-hover:backdrop-blur-[12px] !px-4 min-h-[auto] border-none ${
          isOpen.value
            ? "bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px]"
            : "bg-white"
        }`}
      >
        <div class="flex justify-between items-center w-full">
          <a
            href={item.url}
            class={`py-3 font-['Lato'] text-[16px] text-[#1F251C] group-hover:text-white flex-grow ${
              isOpen.value ? "text-white" : ""
            }`}
          >
            {item.name}
          </a>
          {hasChildren && (
            <button
              class="btn btn-ghost btn-xs px-2 flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                isOpen.value = !isOpen.value;
              }}
            >
              {isOpen.value ? (
                <MinusWhite />
              ) : (
                <span class="group-hover:hidden">
                  <PlusGreen />
                </span>
              )}
              {!isOpen.value && (
                <span class="hidden group-hover:block">
                  <PlusWhite />
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      {hasChildren && isOpen.value && (
        <div class="!px-0 bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px] group-hover:text-white">
          <ul class="max-h-[calc(10*48px)] overflow-y-scroll">
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
