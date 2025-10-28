import { useScript } from "@deco/deco/hooks";

export interface Props {
  /** @title Store ID da Trustvox */
  storeId?: string;
  /** @title ID do produto para teste */
  testProductId?: string;
}

// Script para forçar o carregamento das estrelas
const forceLoadTrustvoxScript = (storeId: string) => {
  // Aguarda um pouco para garantir que a página carregou
  setTimeout(() => {
    // Configura o Store ID
    window._trustvox_shelf_rate = window._trustvox_shelf_rate || [];
    window._trustvox_shelf_rate.push(["_storeId", storeId]);

    // Remove scripts anteriores
    const existingScripts = document.querySelectorAll(
      'script[src*="widget.js"]'
    );
    existingScripts.forEach((script) => script.remove());

    // Carrega o script da Trustvox
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = "//rate.trustvox.com.br/widget.js";
    script.onload = () => {
      // Força a verificação de elementos após 2 segundos
      setTimeout(() => {
        const elements = document.querySelectorAll(
          "[data-trustvox-product-code]"
        );

        elements.forEach((el, index) => {});
      }, 2000);
    };
    script.onerror = () => {
      console.error("Erro ao carregar script Trustvox");
    };
    document.head.appendChild(script);
  }, 500);
};

export default function TrustvoxTest({
  storeId = "125156",
  testProductId = "8472",
}: Props) {
  return (
    <div class="w-full py-8 bg-gray-100">
      <div class="container">
        <h2 class="text-2xl font-bold mb-6">Teste Trustvox</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-4">Informações de Debug</h3>
            <div class="space-y-2 text-sm">
              <p>
                <strong>Store ID:</strong> {storeId}
              </p>
              <p>
                <strong>Test Product ID:</strong> {testProductId}
              </p>
              <p>
                <strong>Script URL:</strong> //rate.trustvox.com.br/widget.js
              </p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-4">Teste de Estrelas</h3>
            <p class="text-sm text-gray-600 mb-4">
              As estrelas devem aparecer abaixo se o produto tiver avaliações:
            </p>

            {/* Div onde as estrelinhas serão renderizadas */}
            <div
              data-trustvox-product-code={testProductId}
              class="min-h-[30px] border border-dashed border-gray-300 p-2 rounded"
            >
              <span class="text-xs text-gray-500">
                Aguardando estrelas para produto ID: {testProductId}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 class="font-semibold text-yellow-800 mb-2">Como testar:</h4>
          <ol class="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Abra o console do navegador (F12)</li>
            <li>Verifique se há logs do script Trustvox</li>
            <li>Procure por elementos com data-trustvox-product-code</li>
            <li>
              Se as estrelas não aparecerem, pode ser que o produto não tenha
              avaliações
            </li>
          </ol>
        </div>
      </div>

      {/* Script para forçar o carregamento */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(forceLoadTrustvoxScript, storeId),
        }}
      />
    </div>
  );
}
