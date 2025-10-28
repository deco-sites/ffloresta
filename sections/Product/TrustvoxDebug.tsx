import { useScript } from "@deco/deco/hooks";

export interface Props {
  /** @title Store ID da Trustvox */
  storeId?: string;
}

// Script de debug para verificar se a Trustvox está funcionando
const debugTrustvoxScript = (storeId: string) => {
  // Verifica se o script global já foi carregado
  setTimeout(() => {
    // Verifica se há scripts da Trustvox carregados
    const trustvoxScripts = document.querySelectorAll(
      'script[src*="trustvox"], script[src*="rate.trustvox"]'
    );
    trustvoxScripts.forEach((script, index) => {});

    // Verifica elementos com data-trustvox-product-code
    const trustvoxElements = document.querySelectorAll(
      "[data-trustvox-product-code]"
    );

    // Tenta forçar o carregamento se necessário
    if (!window._trustvox_shelf_rate) {
      window._trustvox_shelf_rate = [];
      window._trustvox_shelf_rate.push(["_storeId", storeId]);

      // Carrega o script se não estiver presente
      if (trustvoxScripts.length === 0) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "//rate.trustvox.com.br/widget.js";
        script.onload = () => {
          // Verifica novamente após 3 segundos
          setTimeout(() => {
            const elementsAfter = document.querySelectorAll(
              "[data-trustvox-product-code]"
            );

            elementsAfter.forEach((el, index) => {});
          }, 3000);
        };
        script.onerror = () => {
          console.error("❌ Erro ao carregar script Trustvox");
        };
        document.head.appendChild(script);
      }
    } else {
    }
  }, 1000);
};

export default function TrustvoxDebug({ storeId = "125156" }: Props) {
  return (
    <div class="w-full py-8 bg-red-50 border border-red-200">
      <div class="container">
        <h2 class="text-2xl font-bold mb-4 text-red-800">🔍 Debug Trustvox</h2>

        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <h3 class="text-lg font-semibold mb-4">Informações</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Store ID:</strong> {storeId}
              </p>
              <p>
                <strong>Script URL:</strong> //rate.trustvox.com.br/widget.js
              </p>
            </div>
            <div>
              <p>
                <strong>Elemento de teste:</strong>{" "}
                data-trustvox-product-code="8472"
              </p>
              <p>
                <strong>Status:</strong> Verificando...
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <h3 class="text-lg font-semibold mb-4">Teste de Estrelas</h3>
          <p class="text-sm text-gray-600 mb-4">
            Elemento de teste com produto ID 8472:
          </p>

          <div class="border border-dashed border-gray-300 p-4 rounded bg-gray-50">
            <div data-trustvox-product-code="8472" class="min-h-[30px]">
              <span class="text-xs text-gray-500">
                [Aguardando estrelas para produto 8472...]
              </span>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="font-semibold text-blue-800 mb-2">📋 Instruções:</h4>
          <ol class="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Abra o console do navegador (F12)</li>
            <li>Procure por logs que começam com "=== TRUSTVOX DEBUG"</li>
            <li>Verifique se o script está sendo carregado</li>
            <li>Observe se os elementos estão sendo encontrados</li>
            <li>
              Se as estrelas não aparecerem, pode ser que o produto não tenha
              avaliações
            </li>
          </ol>
        </div>
      </div>

      {/* Script de debug */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(debugTrustvoxScript, storeId),
        }}
      />
    </div>
  );
}
