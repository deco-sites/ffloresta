import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
export interface Props {
  /** @description Section title */
  title?: string;

  /** @description See all link */
  cta?: string;
  icon?: ImageWidget;
  headerBanner?: ImageWidget;
}

function Header({ title, cta, icon, headerBanner }: Props) {
  if (!title) {
    return null;
  }

  console.log(headerBanner, "banner");

  return (
    <div
      class={clx(
        "flex justify-between items-center gap-2",
        "2xl:w-full 2xl:container px-0"
      )}
    >
      {/* {icon && <img src={icon} alt={title} />} */}
      <span class="font-['FS_Emeric'] font-bold text-[#1F251C] text-[18px] leading-[100%] sm:text-[26.14px]">
        {title}
      </span>
      {cta && (
        <a class="text-sm font-medium text-primary" href={cta}>
          See all
        </a>
      )}
      {headerBanner && <img src={headerBanner} alt={title} />}
    </div>
  );
}

interface Tab {
  title: string;
}

function Tabbed({ children }: { children: JSX.Element }) {
  return <>{children}</>;
}

function Container({ class: _class, ...props }: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      class={clx(
        "container flex flex-col gap-4 sm:gap-6 w-full p-5 sm:py-10 2xl:px-0",
        _class?.toString()
      )}
    />
  );
}

function Placeholder({
  height,
  class: _class,
}: {
  height: string;
  class?: string;
}) {
  return (
    <div
      style={{
        height,
        containIntrinsicSize: height,
        contentVisibility: "auto",
      }}
      class={clx("flex justify-center items-center", _class)}
    >
      <span class="loading loading-spinner" />
    </div>
  );
}

function Section() {}

Section.Container = Container;
Section.Header = Header;
Section.Tabbed = Tabbed;
Section.Placeholder = Placeholder;

export default Section;
