import type { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import { relative } from "../../sdk/url.ts";
import { useId } from "../../sdk/useId.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";
import { useSection } from "@deco/deco/hooks";

interface Props {
  product: Product;
}

const colors: Record<string, string | undefined> = {
  vermelho: "#CE0505",
  azul: "#0500FF",
  verde: "#2BEA44",
  preto: "#ffffff",
  laranja: "#FF7E00",
  Yellow: "#F1E8B0",
  DarkBlue: "#4E6E95",
  LightBlue: "#bedae4",
  DarkGreen: "#446746",
  LightGreen: "#aad1b5",
  DarkYellow: "#c6b343",
  LightYellow: "#F1E8B0",
};

const useStyles = (value: string, checked: boolean) => {
  const color = colors[value];
  if (color) {
    return clx(
      "rounded-full border border-[#C9CFCF]",
      "ring-2 ring-offset-2",
      checked ? "ring-primary" : "ring-transparent",
      "w-[21px] h-[21px]",
      "md:w-[21px] md:h-[21px]",
      "w-[57px] h-[57px] md:w-[21px] md:h-[21px]" // Mobile size
    );
  }
  return clx(
    "btn btn-ghost border-[#C9CFCF] hover:bg-base-200 hover:border-[#C9CFCF]",
    "ring-2 ring-offset-2",
    checked ? "ring-primary" : "ring-transparent border-[#C9CFCF]"
  );
};

interface RingProps {
  value: string;
  checked?: boolean;
  class?: string;
}

const Ring = ({ value, checked = false, class: _class }: RingProps) => {
  const color = colors[value];
  const styles = clx(useStyles(value, checked), _class);
  return (
    <span style={{ backgroundColor: color }} class={`${styles} flex`}>
      {color ? null : value}
    </span>
  );
};

function VariantSelector({ product }: Props) {
  const { url, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);
  const relativeUrl = relative(url);
  const id = useId();

  const filteredNames = Object.keys(possibilities).filter(
    (name) =>
      name.toLowerCase() !== "title" && name.toLowerCase() !== "default title"
  );

  if (filteredNames.length === 0) {
    return null;
  }

  const getSelectedValue = (name: string) => {
    const entries = Object.entries(possibilities[name]);
    for (const [value, link] of entries) {
      if (relative(link) === relativeUrl) {
        return value;
      }
    }
    return null;
  };

  return (
    <ul class="flex flex-col gap-6">
      {filteredNames.map((name) => {
        const selectedValue = getSelectedValue(name);
        const isColor =
          name.toLowerCase() === "cor" || name.toLowerCase() === "color";

        return (
          <li key={name} class="flex flex-col items-start">
            {/* Header */}
            <span
              class={clx("font-normal text-sm leading-[170%] text-[#1F251C]")}
            >
              {isColor
                ? `Cor${selectedValue ? `\u00A0\u00A0${selectedValue}` : ""}`
                : name}
            </span>

            {/* Options container */}
            <div
              class={clx(
                isColor ? "mt-2.5" : "mt-3",
                isColor
                  ? "flex flex-wrap gap-1.5 justify-start md:justify-start"
                  : "flex flex-wrap gap-x-2 gap-y-1",
                "w-full"
              )}
            >
              {Object.entries(possibilities[name])
                .filter(([value]) => value)
                .map(([value, link]) => {
                  const relativeLink = link ? relative(link) : "";
                  const checked = relativeLink === relativeUrl;
                  const disabled = !link;

                  return (
                    <label
                      key={value}
                      class={clx(
                        "cursor-pointer grid grid-cols-1 grid-rows-1 place-items-center relative",
                        "[.htmx-request_&]:opacity-50",
                        disabled && "opacity-30 pointer-events-none"
                      )}
                      {...(!disabled && {
                        "hx-get": useSection({ href: relativeLink }),
                      })}
                    >
                      <input
                        class="hidden peer"
                        type="radio"
                        name={`${id}-${name}`}
                        checked={checked}
                        disabled={disabled}
                      />

                      {isColor ? (
                        <div class="relative">
                          <Ring value={value} checked={checked} />
                        </div>
                      ) : (
                        <div
                          class={clx(
                            "min-h-[20px] md:min-h-[20px] px-2 py-1",
                            "text-xs leading-[170%] font-normal",
                            "border border-black",
                            "flex items-center justify-center text-center",
                            "min-h-[41px] md:min-h-[20px]",
                            disabled && "opacity-30"
                          )}
                        >
                          {value}
                        </div>
                      )}
                    </label>
                  );
                })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default VariantSelector;
