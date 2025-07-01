import { useSignal } from "@preact/signals";
import Component from "../components/product/ProductDescription.tsx";

interface Props {
  page: ProductDetailsPage | null;
}
export default function ProductDescriptionIsland({ page }: Props) {
  const activeTab = useSignal("Descrição");

  console.log(page.product, "product");
  // Função para buscar propriedades específicas
  const getProperty = (key: string) =>
    page.product?.isVariantOf?.additionalProperty?.find(
      (prop) => prop.name === key,
    )?.value;

  const description = page.product?.description || "";
  const diferenciais = getProperty("Diferenciais");
  const especificacoes = page.product?.isVariantOf?.additionalProperty?.filter(
    (prop) =>
      prop.propertyID === "Especificações Técnicas" && prop.name && prop.value,
  );

  console.log(description, "description");

  const tabs = [];

  if (description) {
    tabs.push({
      title: "Descrição",
      content: (
        <div class="py-6">
          <h3 class="font-['FS_Emeric'] font-bold text-lg text-[#3A4332] mb-4">
            Descrição do Produto
          </h3>
          <div
            class="text-[#3A4332]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      ),
    });
  }

  if (especificacoes && especificacoes.length > 0) {
    tabs.push({
      title: "Especificações Técnicas",
      content: (
        <div class="py-6">
          <h3 class="font-['FS_Emeric'] font-bold text-lg text-[#3A4332] mb-4">
            Detalhes Técnicos
          </h3>
          <table class="w-full text-[#3A4332] font-['FS_Emeric']">
            <tbody>
              {especificacoes.map((spec) => (
                <tr key={spec.name} class="border-b border-[#9AA192]">
                  <td class="py-3 font-bold w-1/3">{spec.name}</td>
                  <td class="py-3">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    });
  }

  if (diferenciais) {
    tabs.push({
      title: "Diferenciais",
      content: (
        <div class="py-6">
          <h3 class="font-['FS_Emeric'] font-bold text-lg text-[#3A4332] mb-4">
            Nossos Diferenciais
          </h3>
          <pre class="text-[#3A4332] whitespace-pre-wrap font-['FS_Emeric']">
            {diferenciais}
          </pre>
        </div>
      ),
    });
  }

  const handleTabChange = (tab: string) => {
    activeTab.value = tab;
  };

  if (tabs.length === 0) return null; // Não renderiza nada se não houver conteúdo

  return (
    <Component
      activeTab={activeTab.value}
      onTabChange={handleTabChange}
      tabs={tabs}
    />
  );
}
