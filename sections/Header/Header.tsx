import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import Menu from "../../components/header/Menu.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { SIDEMENU_CONTAINER_ID, SIDEMENU_DRAWER_ID } from "../../constants.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import SignIn from "../../components/header/SignIn.tsx";
import NavItemIsland from "../../islands/NavItemIsland.tsx";
import SearchBarIsland from "../../islands/CustomSearchBar.tsx";
import HeaderDrawer from "../../components/header/HeaderDrawer.tsx";

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}

export interface SearchBarProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /**
   * @title Mostrar sugestões de produtos
   * @default true
   */
  showProductSuggestions?: boolean;
  /**
   * @title Mostrar termos de busca
   * @default true
   */
  showSearchTerms?: boolean;
  /**
   * @title Nome da conta VTEX
   * @description Exemplo: 'minhaloja'
   */
  vtexAccount: string;
}

export interface SectionProps {
  alerts?: HTMLWidget[];
  navItems?: SiteNavigationElement[] | null;
  searchBar?: SearchBarProps;
  logo: Logo;
  loading?: "eager" | "lazy";
}

type Props = Omit<SectionProps, "alert">;

function Header({ alerts = [], logo, navItems, loading, searchBar }: Props) {
  return (
    <header class="h-[154px] lg:h-[174px]">
      <div class="bg-[#1F251C] w-full z-40 fixed top-0">
        {alerts.length > 0 && <Alert alerts={alerts} />}
        {/* Desktop */}
        <div class="hidden lg:block">
          <Desktop
            logo={logo}
            navItems={navItems}
            loading={loading}
            searchBar={searchBar}
          />
        </div>
        {/* Mobile */}
        <div class="lg:hidden">
          <Mobile
            logo={logo}
            navItems={navItems}
            loading={loading}
            searchBar={searchBar}
          />
        </div>
      </div>
    </header>
  );
}

const Desktop = ({ navItems, logo, searchBar }: Props) => (
  <>
    <div>
      <div class="container flex items-center justify-between p-5 gap-4 2xl:px-0">
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

        <div class="flex-1 max-w-xl mx-4">
          {searchBar && <SearchBarIsland {...searchBar} />}
        </div>

        <div class="flex items-center gap-6">
          <div class="flex gap-[14px] cursor-pointer text-white place-self-end">
            <SignIn variant="desktop" />
          </div>
          <div class="flex items-center place-self-end">
            <Bag />
          </div>
        </div>
      </div>

      <div class="bg-[#FDFFF5] flex justify-between items-center">
        <ul class="container flex justify-between p-0">
          {navItems?.slice(0, 10).map((item) => <NavItemIsland item={item} />)}
        </ul>
      </div>
    </div>
  </>
);

const Mobile = ({
  logo,
  navItems,
  loading,
  searchBar,
}: Props & { alerts: HTMLWidget[] }) => (
  <div class="w-full">
    <div class="flex items-center justify-between w-full py-3 px-4 gap-2">
      <div class="flex-1 flex justify-start">
        <label
          for={SIDEMENU_DRAWER_ID}
          class="w-[38px] h-[38px] cursor-pointer flex items-center"
          aria-label="open menu"
        >
          <Icon id="menu" class="text-white" />
        </label>
      </div>

      <div class="flex-1 flex justify-center">
        {logo && (
          <a
            href="/"
            class="inline-flex items-center justify-center"
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
      </div>

      <div class="flex-1 flex justify-end">
        <Bag />
      </div>
    </div>

    {/* Searchbar row - full width */}
    {searchBar && (
      <div class="w-full">
        <SearchBarIsland {...searchBar} showProductSuggestions={false} />
      </div>
    )}

    <HeaderDrawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <HeaderDrawer.Aside drawer={SIDEMENU_DRAWER_ID}>
          {loading === "lazy"
            ? (
              <div
                id={SIDEMENU_CONTAINER_ID}
                class="h-full flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <span class="loading loading-spinner" />
              </div>
            )
            : <Menu navItems={navItems ?? []} />}
        </HeaderDrawer.Aside>
      }
    />
  </div>
);

export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  <Header {...(props as any)} loading="lazy" />
);

export default Header;
