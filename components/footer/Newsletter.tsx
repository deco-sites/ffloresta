import { useSignal } from "@preact/signals";
import { invoke } from "../../runtime.ts";

function Newsletter() {
  const response = useSignal<unknown>(null);
  let loading = useSignal<boolean>(false);

  const handleSubmit = async () => {
    try {
      loading.value = true;
      const nameInput = document.getElementById(
        "name",
      ) as HTMLInputElement | null;
      const emailInput = document.getElementById(
        "email",
      ) as HTMLInputElement | null;
      const politicaInput = document.getElementById(
        "politica",
      ) as HTMLInputElement | null;

      if (!nameInput || !emailInput || !politicaInput) {
        alert("Não foi possível acessar os campos do formulário.");
        return;
      }

      const name = nameInput.value.trim();
      const emaill = emailInput.value.trim();
      const politica = politicaInput.checked ? true : false;

      const res = await invoke.site.actions.newsletter.subscribe({
        emaill,
        name,
        politica,
      });

      response.value = res;

      nameInput.value = "";
      emailInput.value = "";
      politicaInput.checked = false;
    } finally {
      loading.value = false;
    }
  };

  return (
    <div class="">
      <div class="w-full flex justify-center bg-[#94A57D] pb-[30px] pt-[30px] p-5">
        <div class="flex flex-col max-w-[506px] lg:max-w-[738px] ">
          <p class="text-[20px] lg:text-[22px] text-[#ffffff] text-center font-normal mb-[20px]">
            RECEBA DESCONTOS E NOVIDADES DIRETAMENTE NO SEU E-MAIL
          </p>
          <div class="space-y-4">
            <div class="flex flex-col lg:flex-row w-full gap-2 lg:items-end  items-center">
              <div class="flex flex-col w-full lg:w-[40%] max-w-[300px]">
                <label
                  class="block text-[16px] font-normal text-[#ffffff] mb-1"
                  for="name"
                >
                  INFORME SEU NOME
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  class="w-full px-3 py-2 border outline-none border-write text-[#ffffff] placeholder-white max-h-[36px] shadow-sm focus:outline-none focus:ring-2  bg-[#94A57D]"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div class="flex flex-col  w-full lg:w-[40%] max-w-[300px]">
                <label
                  class="block text-[16px] font-normal text-[#ffffff] mb-1"
                  for="email"
                >
                  INFORME SEU EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="w-full px-3 py-2 border outline-none border-write text-[#ffffff] placeholder-white max-h-[36px] shadow-sm focus:outline-none focus:ring-2  bg-[#94A57D]"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                class="w-full text-[12px] text-white py-2 max-h-[36px] max-w-[210px] lg:max-w-[100px] bg-[#4B5941] flex justify-center items-center"
              >
                CADASTRAR
              </button>
            </div>

            <label htmlFor="politica" class="flex flex-row gap-2 items-start">
              <input type="checkbox" name="politica" id="politica" />
              <p class="text-[12px] text-white">
                {" "}
                AO SE CADASTRAR VOCÊ IRÁ CONCORDAR COM A NOSSA POLÍTICA DE
                PRIVACIDADE E PODERÁ ALTERAR OU CANCELAR A NEWSLETTER A QUALQUER
                MOMENTO QUE VOCÊ DESEJAR. AQUI VOCÊ ECONOMIZA NAS SUAS COMPRAS E
                NÃO RECEBE SPAM
              </p>
            </label>

            {loading.value === true
              ? (
                <div class="text-white text-center font-bold">
                  Enviando dados...
                </div>
              )
              : (
                ""
              )}

            {response.value !== null
              ? (
                <div class="text-white text-center font-bold">
                  Inscrição concluída com sucesso!
                </div>
              )
              : (
                ""
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsletter;
