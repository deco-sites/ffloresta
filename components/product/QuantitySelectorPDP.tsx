import { type JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";

interface Props extends Omit<JSX.IntrinsicElements["input"], "onInput"> {
  value: number;
  onInput: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void;
}

function QuantitySelectorPDP({
  id = useId(),
  disabled,
  min = 1,
  max = 99,
  value,
  onInput,
  ...props
}: Props) {
  const update = (delta: number) => {
    const newValue = Math.min(Math.max(value + delta, min), max);
    const synthetic = {
      ...new Event("input", { bubbles: true }),
      target: { value: newValue.toString() },
    } as JSX.TargetedEvent<HTMLInputElement, Event>;

    onInput(synthetic);
  };

  return (
    <div class="flex items-center border rounded-md bg-gray-100 text-black w-24">
      <button
        type="button"
        class="w-8 h-8 text-xl leading-none"
        onClick={() => update(-1)}
        disabled={disabled}
      >
        -
      </button>
      <input
        id={id}
        class={clx(
          "text-center text-sm w-full bg-gray-100 text-black border-0 outline-none",
        )}
        type="number"
        min={min}
        max={max}
        value={value}
        onInput={onInput}
        disabled={disabled}
        {...props}
      />
      <button
        type="button"
        class="w-8 h-8 text-xl leading-none"
        onClick={() => update(1)}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelectorPDP;
