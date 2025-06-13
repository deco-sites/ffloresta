import { useSignal } from "@preact/signals";
import Component from "../components/product/ProductDescription.tsx";

export default function ProductDescriptionIsland() {
  const activeTab = useSignal("Galeria");

  const tabs = [
    {
      title: "Galeria",
      content: (
        <div class="py-6">
          <h3 class="font-['FS_Emeric'] font-bold text-lg text-[#3A4332] mb-4">
            Galeria do Produto
          </h3>
          <p class="text-[#3A4332]">
            Aqui serão exibidas fotos adicionais do produto em diferentes
            ângulos e situações de uso.
          </p>
        </div>
      ),
    },
    {
      title: "Diferenciais",
      content: (
        <div class="py-6">
          <h3 class="font-['FS_Emeric'] font-bold text-lg text-[#3A4332] mb-4">
            Nossos Diferenciais
          </h3>
          <ul class="list-disc pl-5 text-[#3A4332] space-y-2">
            <li>Material 100% sustentável</li>
            <li>Garantia estendida de 2 anos</li>
            <li>Design premium e exclusivo</li>
            <li>Produção artesanal</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Especificações Técnicas",
      content: (
        <div class="py-6">
          <h3 class="font-['FS_Emeric'] font-bold text-lg text-[#3A4332] mb-4">
            Detalhes Técnicos
          </h3>
          <table class="w-full text-[#3A4332]">
            <tbody>
              <tr class="border-b border-[#9AA192]">
                <td class="py-3 font-bold">Material</td>
                <td class="py-3">Madeira de reflorestamento</td>
              </tr>
              <tr class="border-b border-[#9AA192]">
                <td class="py-3 font-bold">Dimensões</td>
                <td class="py-3">45cm x 30cm x 20cm</td>
              </tr>
              <tr class="border-b border-[#9AA192]">
                <td class="py-3 font-bold">Peso</td>
                <td class="py-3">2,5kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "Avaliações",
      content: (
        <div class="py-6">
          <h3 class="font-['FS_Emeric'] font-bold text-lg text-[#3A4332] mb-4">
            O que nossos clientes dizem
          </h3>
          <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div class="flex items-center mb-2">
              <div class="text-yellow-400">★★★★★</div>
              <span class="ml-2 text-sm text-[#677357]">5/5</span>
            </div>
            <p class="text-[#3A4332] italic">
              "Produto de excelente qualidade, superou minhas expectativas!"
            </p>
            <p class="text-sm text-[#9AA192] mt-2">- João S.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Ajuda",
      content: (
        <div class="py-6">
          <h3 class="font-['FS_Emeric'] font-bold text-lg text-[#3A4332] mb-4">
            Precisa de ajuda?
          </h3>
          <div class="space-y-4 text-[#3A4332]">
            <div>
              <h4 class="font-bold">Entrega</h4>
              <p>Prazo de entrega de 5 a 10 dias úteis para todo o Brasil.</p>
            </div>
            <div>
              <h4 class="font-bold">Trocas e Devoluções</h4>
              <p>Aceitamos devoluções em até 7 dias após o recebimento.</p>
            </div>
            <div>
              <h4 class="font-bold">Dúvidas</h4>
              <p>Fale conosco pelo WhatsApp (11) 99999-9999</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleTabChange = (tab: string) => {
    console.log("Tab changed to:", tab);
    activeTab.value = tab;
  };

  return (
    <Component
      activeTab={activeTab.value}
      onTabChange={handleTabChange}
      tabs={tabs}
    />
  );
}
