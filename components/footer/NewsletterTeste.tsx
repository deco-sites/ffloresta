import { useSignal } from "@preact/signals";
import type { JSX } from "preact";
import { invoke } from "../../runtime.ts";

export interface Form {
  placeholder?: string;
  buttonText?: string;
  /** @format html */
  helpText?: string;
}

export interface Props {
  content: {
    /** @format textarea */
    description?: string;
    form?: Form;
  };
  layout?: {
    tiled?: boolean;
  };
}

function Newsletter({ content, layout = {} }: Props) {
  const { tiled = false } = layout;
  const loading = useSignal(false);
  const response = useSignal<unknown>(null);

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      loading.value = true;

      const emaill = (
        e.currentTarget.elements.namedItem("email") as RadioNodeList
      )?.value;

      const name = (e.currentTarget.elements.namedItem("name") as RadioNodeList)
        ?.value;

      const res = await invoke.vtex.actions.masterdata.createDocument({
        data: { emaill, name },
        acronym: "NL",
      });

      response.value = res;
    } finally {
      loading.value = false;
    }
  };

  return (
    <form
      class="form-control newsletter flex items-start flex-col justify-center lg:flex-row lg:gap-6 px-8 sm:px-10 py-7 bg-black"
      onSubmit={handleSubmit}
    >
      {response.value !== null
        ? <div class="text-white">Inscrição concluída com sucesso!</div>
        : (
          <>
            <p class="text-start text-lg text-white lg:text-lg lg:mb-0 lg:w-[280px]">
              {content?.description || ""}
            </p>
            <div className="flex flex-wrap w-fit lg:w-newsletter-inputs">
              <div className="flex w-full flex-col justify-center lg:flex-row lg:gap-6">
                <input
                  name="name"
                  class="lg:flex-1 input min-w-[250px] w-full lg:w-[240px] input-bordered rounded-none placeholder-center text-left border-1 border-solid border-input-gray-bd mt-4 lg:mt-0 text-sm bg-transparent text-white active:bg-active-gray-input"
                  placeholder={"SEU NOME"}
                />
                <input
                  name="email"
                  class="lg:flex-1 input min-w-[250px] w-full lg:w-[240px] input-bordered rounded-none placeholder-center text-left mt-4 lg:mt-0 border-1 border-solid border-white text-sm bg-transparent text-white"
                  placeholder={"SEU EMAIL"}
                />
                <button
                  type="submit"
                  class="btn disabled:loading w-full lg:w-28 mt-4 lg:mt-0 rounded-none bg-white"
                  disabled={loading}
                >
                  ASSINAR!
                </button>
              </div>
              <span class="mt-2 text-white w-full text-sm">
                Ao clicar em ASSINAR, você concorda com os{" "}
                <a
                  href="/politicas-de-privacidade"
                  class="font-bold text-white underline"
                >
                  Termos de Privacidade
                </a>{" "}
                e autoriza o uso dos seus dados.
              </span>
            </div>
          </>
        )}
    </form>
  );
}

export default Newsletter;
