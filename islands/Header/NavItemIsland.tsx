import NavItem from "../../components/header/NavItem.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

export default function NavItemIsland({
  item,
}: {
  item: SiteNavigationElement;
}) {
  return <NavItem item={item} />;
}
