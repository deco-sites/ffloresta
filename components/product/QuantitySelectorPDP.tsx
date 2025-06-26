import { type JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";

interface Props
  extends Omit<JSX.IntrinsicElements["input"], "value" | "onInput"> {
  value: number;
  onChange: (value: number) => void;
}

function QuantitySelectorPDP({
  id = useId(),
  min = 1,
  max = 99,
  value,
  onChange,
  ...props
}: Props) {
  const clamp = (v: number) => Math.min(Math.max(v, min), max);

  return (
    <div class="flex items-center border-none bg-[#D9D9D9] text-black w-16">
      <button
        type="button"
        class="w-8 h-8 text-xl leading-none"
        onClick={() => onChange(clamp(value - 1))}
      >
        -
      </button>
      <input
        id={id}
        class={clx(
          "text-center text-sm w-full bg-transparent text-black border-0 outline-none"
        )}
        type="number"
        min={min}
        max={max}
        value={value}
        onInput={(e) => {
          const v = Number((e.currentTarget as HTMLInputElement).value);
          if (!isNaN(v)) onChange(clamp(v));
        }}
        {...props}
      />
      <button
        type="button"
        class="w-8 h-8 text-xl leading-none"
        onClick={() => onChange(clamp(value + 1))}
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelectorPDP;
