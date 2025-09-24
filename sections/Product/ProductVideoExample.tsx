import type { Product } from "apps/commerce/types.ts";
import type { VideoWidget } from "apps/admin/widgets.ts";
import ProductCard from "../../components/product/ProductCard/ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";

export interface Props {
  /** @description Produto de exemplo para demonstrar vídeos */
  product?: Product;
  /** @description Vídeo frontal do produto */
  frontVideo?: VideoWidget;
  /** @description Vídeo traseiro/hover do produto */
  backVideo?: VideoWidget;
  /** @description Título da seção */
  title?: string;
}

/**
 * @title Exemplo de Produto com Vídeo
 * @description Esta seção demonstra como configurar produtos com vídeos no SearchResult
 */
export default function ProductVideoExample({
  product,
  frontVideo,
  backVideo,
  title = "Exemplo de Produto com Vídeo",
}: Props) {
  const id = useId();

  if (!product) {
    return (
      <div class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-4">{title}</h2>
        <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p class="font-bold">Configuração necessária:</p>
          <p>Selecione um produto para ver o exemplo funcionando.</p>
        </div>
      </div>
    );
  }

  // Criar uma cópia do produto com os vídeos adicionados
  const productWithVideos: Product = {
    ...product,
    additionalProperty: [
      ...(product.additionalProperty || []),
      ...(frontVideo ? [{
        "@type": "PropertyValue" as const,
        name: "frontVideo",
        value: frontVideo,
      }] : []),
      ...(backVideo ? [{
        "@type": "PropertyValue" as const,
        name: "backVideo", 
        value: backVideo,
      }] : []),
    ],
  };

  return (
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">{title}</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Produto original */}
        <div>
          <h3 class="text-lg font-semibold mb-4">Produto Original (apenas imagens)</h3>
          <div class="max-w-xs">
            <ProductCard
              product={product}
              preload={true}
              index={0}
            />
          </div>
        </div>

        {/* Produto com vídeos */}
        <div>
          <h3 class="text-lg font-semibold mb-4">Produto com Vídeos</h3>
          <div class="max-w-xs">
            <ProductCard
              product={productWithVideos}
              preload={true}
              index={1}
            />
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4 text-blue-800">Como configurar vídeos nos produtos:</h3>
        <div class="space-y-3 text-blue-700">
          <p><strong>1. Via Admin da deco.cx:</strong></p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>Acesse o produto no admin</li>
            <li>Adicione propriedades adicionais com os nomes:</li>
            <li class="ml-4">• <code class="bg-blue-100 px-1 rounded">frontVideo</code> - para o vídeo principal</li>
            <li class="ml-4">• <code class="bg-blue-100 px-1 rounded">backVideo</code> - para o vídeo de hover</li>
          </ul>
          
          <p class="mt-4"><strong>2. Via API/Integração:</strong></p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>Adicione ao array <code class="bg-blue-100 px-1 rounded">additionalProperty</code> do produto</li>
            <li>Use os nomes: <code class="bg-blue-100 px-1 rounded">frontVideo</code>, <code class="bg-blue-100 px-1 rounded">backVideo</code></li>
          </ul>

          <p class="mt-4"><strong>3. Formatos suportados:</strong></p>
          <ul class="list-disc list-inside ml-4">
            <li>MP4 (recomendado)</li>
            <li>WebM</li>
            <li>OGV</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const loader = (props: Props) => {
  return props;
};