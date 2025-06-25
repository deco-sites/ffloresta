import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import Menu from "../../components/header/Menu.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Modal from "../../components/ui/Modal.tsx";
import {
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT_MOBILE,
  SEARCHBAR_DRAWER_ID,
  SEARCHBAR_POPUP_ID,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import SignIn from "../../components/header/SignIn.tsx";
import NavItemIsland from "../../islands/NavItemIsland.tsx";

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}

export interface SectionProps {
  alerts?: HTMLWidget[];
  navItems?: SiteNavigationElement[] | null;
  searchbar: SearchbarProps;
  logo: Logo;
  loading?: "eager" | "lazy";
}

type Props = Omit<SectionProps, "alert">;

function Header({ alerts = [], logo, navItems, searchbar, loading }: Props) {
  console.log(navItems, "navItems");

  return (
    <header>
      <div class="bg-[#1F251C]  w-full z-40">
        {alerts.length > 0 && <Alert alerts={alerts} />}
        {/* Desktop */}
        <div class="hidden lg:block">
          <Desktop
            logo={logo}
            navItems={navItems}
            searchbar={searchbar}
            loading={loading}
          />
        </div>
        {/* Mobile */}
        <div class="lg:hidden">
          <Mobile
            logo={logo}
            navItems={navItems}
            searchbar={searchbar}
            loading={loading}
          />
        </div>
      </div>
    </header>
  );
}

const Desktop = ({ navItems, logo, searchbar, loading }: Props) => (
  <>
    <Modal id={SEARCHBAR_POPUP_ID}>
      <div
        class="absolute top-0 bg-base-100 container max-w-[638px]"
        style={{ marginTop: HEADER_HEIGHT_MOBILE }}
      >
        {loading === "lazy" ? (
          <div class="flex justify-center items-center">
            <span class="loading loading-spinner" />
          </div>
        ) : (
          <Searchbar {...searchbar} />
        )}
      </div>
    </Modal>

    <div>
      <div class="container flex items-center justify-between p-5 gap-4">
        <div class="place-self-start">
          <a href="/" aria-label="Store logo">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
        </div>

        <label
          for={SEARCHBAR_POPUP_ID}
          class="flex items-center gap-2 w-full max-w-[638px] h-[38px] bg-[#D9D9D9] px-4 cursor-pointer"
          aria-label="search icon button"
        >
          <Icon id="search" class="text-gray-600" />
          <span class="text-gray-600 text-sm font-normal truncate">
            {searchbar.placeholder}
          </span>
        </label>

        <div class="flex items-center gap-6">
          <div class="flex gap-[14px] cursor-pointer text-white place-self-end">
            <SignIn variant={"desktop"} />
          </div>
          <div class="flex gap-[14px] cursor-pointer text-white place-self-end">
            <Bag />
            <span class="hidden md:block">CARRINHO</span>
          </div>
        </div>
      </div>

      <div class="bg-white flex justify-between items-center">
        <ul class="container flex justify-center">
          {navItems?.slice(0, 10).map((item) => (
            <NavItemIsland item={item} />
          ))}
        </ul>
        <div>{/* ship to */}</div>
      </div>
    </div>
  </>
);

const Mobile = ({ logo, searchbar, navItems, loading }: Props) => (
  <>
    <Drawer
      id={SEARCHBAR_DRAWER_ID}
      aside={
        <Drawer.Aside title="Search" drawer={SEARCHBAR_DRAWER_ID}>
          <div class="w-screen overflow-y-auto">
            {loading === "lazy" ? (
              <div class="h-full w-full flex items-center justify-center">
                <span class="loading loading-spinner" />
              </div>
            ) : (
              <Searchbar {...searchbar} />
            )}
          </div>
        </Drawer.Aside>
      }
    />
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <Drawer.Aside title="" drawer={SIDEMENU_DRAWER_ID}>
          {loading === "lazy" ? (
            <div
              id={SIDEMENU_CONTAINER_ID}
              class="h-full flex items-center justify-center"
              style={{ minWidth: "100vw" }}
            >
              <span class="loading loading-spinner" />
            </div>
          ) : (
            <Menu navItems={navItems ?? []} />
          )}
        </Drawer.Aside>
      }
    />

    <div class="flex items-center justify-between w-screen py-3 px-5 gap-2">
      <label
        for={SIDEMENU_DRAWER_ID}
        class="w-[38px] h-[38px] cursor-pointer"
        aria-label="open menu"
      >
        <Icon id="menu" class="text-white" />
      </label>

      {logo && (
        <a
          href="/"
          class="flex-grow inline-flex items-center justify-center"
          aria-label="Store logo"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 100}
            height={logo.height || 13}
          />
        </a>
      )}

      <label
        for={SEARCHBAR_DRAWER_ID}
        class="flex items-center justify-center w-[38px] h-[38px]"
        aria-label="search icon button"
      >
        <Icon id="search" class="text-white" />
      </label>
      <Bag />
    </div>
  </>
);

export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  <Header {...(props as any)} loading="lazy" />
);
export default Header;
