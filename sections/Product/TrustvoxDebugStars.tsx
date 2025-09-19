import { Product } from "apps/commerce/types.ts";

export interface Props {
  /** @title Produto para debug */
  product?: Product | null;
  /** @title Store ID da Trustvox */
  storeId?: string;
}

export default function TrustvoxDebugStars({ 
  product,
  storeId = "125156"
}: Props) {
  if (!product) {
    return (
      <div class="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h3 class="font-bold text-lg mb-2">Debug Trustvox Stars - Nenhum produto fornecido</h3>
      </div>
    );
  }

  // Extrai todos os IDs possíveis
  const refId = product?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
  const vtexProductId = product?.inProductGroupWithID;
  const sku = product?.sku;
  const productIdFallback = product?.productID;
  
  // Ordem de prioridade: vtexProductId > refId > sku > productID
  const finalProductId = vtexProductId || refId || sku || productIdFallback || "";

  return (
    <div class="p-4 bg-blue-100 border border-blue-400 rounded mb-4">
      <h3 class="font-bold text-lg mb-2">Debug Trustvox Stars</h3>
      
      <div class="mb-4">
        <h4 class="font-semibold mb-2">Informações do Produto:</h4>
        <p><strong>Nome:</strong> {product.name}</p>
        <p><strong>URL:</strong> {product.url}</p>
      </div>

      <div class="mb-4">
        <h4 class="font-semibold mb-2">IDs Disponíveis:</h4>
        <p><strong>vtexProductId (inProductGroupWithID):</strong> {vtexProductId || "❌ Não encontrado"}</p>
        <p><strong>RefId:</strong> {refId || "❌ Não encontrado"}</p>
        <p><strong>SKU:</strong> {sku || "❌ Não encontrado"}</p>
        <p><strong>productID:</strong> {productIdFallback || "❌ Não encontrado"}</p>
        <p><strong>ID Final Usado:</strong> {finalProductId || "❌ Nenhum ID disponível"}</p>
      </div>

      <div class="mb-4">
        <h4 class="font-semibold mb-2">Componente Trustvox Stars:</h4>
        {finalProductId ? (
          <div>
            <p class="text-green-600 mb-2">✅ ID encontrado: {finalProductId}</p>
            <div class="trustvox-stars">
              <div data-trustvox-product-code={finalProductId}></div>
            </div>
            <p class="text-sm text-gray-600 mt-2">
              Se as estrelas não aparecem acima, pode ser que:
              <br />• O produto não tenha avaliações ainda
              <br />• O script da Trustvox não carregou
              <br />• O ID do produto não está correto na Trustvox
            </p>
          </div>
        ) : (
          <p class="text-red-600">❌ Nenhum ID válido encontrado - Estrelas não podem ser exibidas</p>
        )}
      </div>

      <div class="mb-4">
        <h4 class="font-semibold mb-2">Dados Completos do Produto (JSON):</h4>
        <details class="bg-white p-2 rounded border">
          <summary class="cursor-pointer font-medium">Clique para ver dados completos</summary>
          <pre class="text-xs mt-2 overflow-auto max-h-40">
            {JSON.stringify(product, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}