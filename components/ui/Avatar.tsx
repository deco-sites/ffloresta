import { clx } from "../../sdk/clx.ts";

/**
 * This component renders the filter and selectors for skus.
 * TODO: Figure out a better name for this component.
 */
interface Props {
  variant?: "active" | "disabled" | "default";
  content: string;
}

const colors: Record<string, Record<string, string>> = {
  "azul-clara": { backgroundColor: "#87CEFA" },
  "azul-marinho": { backgroundColor: "#000080" },
  "branca": { backgroundColor: "#FFFFFF" },
  "cinza": { backgroundColor: "#808080" },
  "cinza-escura": { backgroundColor: "#A9A9A9" },
  "laranja": { backgroundColor: "#FFA500" },
  "marrom": { backgroundColor: "#A52A2A" },
  "preta": { backgroundColor: "#161616" },
  "verde-clara": { backgroundColor: "#90EE90" },
  "vermelha": { backgroundColor: "#FF0000" },
};

const variants = {
  active: "ring-2 ring-[#1F251C] ring-offset-2",
  disabled: "line-through opacity-50",
  default: "ring-1 ring-gray-300 ring-offset-1",
};

function Avatar({ content, variant = "default" }: Props) {
  return (
    <div class="avatar placeholder relative">
      <div
        class={clx(
          "h-6 w-6",
          "rounded-full",
          "transition-all duration-200",
          variants[variant],
        )}
        style={colors[content]}
      >
        <span class="uppercase text-xs">
          {colors[content] ? "" : content.substring(0, 2)}
        </span>
        {variant === "active" && (
          <div class="absolute inset-0 rounded-full border-2 border-[#1F251C] bg-transparent">
            <svg
              class="absolute inset-0 w-full h-full text-[#1F251C]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default Avatar;
