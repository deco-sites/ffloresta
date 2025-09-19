import { ProductDetailsPage } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  /** @title Store ID */
  storeId?: string;
  /** @title Widget Title */
  title?: string;
  /** @description Mostrar apenas se houver produto */
  showOnlyWithProduct?: boolean;
}

// Script da Trustvox seguindo exatamente a documentação
const trustvoxProductScript = (storeId: string, productId: string, productName: string, productPhotos: string[]) => {
  // Aguarda um pouco para garantir que a página carregou
  setTimeout(() => {
    // Limpa qualquer configuração anterior
    window._trustvox = [];
    
    // Configura os dados conforme documentação da Trustvox
    window._trustvox.push(['_storeId', storeId]);
    window._trustvox.push(['_productId', productId]);
    window._trustvox.push(['_productName', productName]);
    window._trustvox.push(['_productPhotos', productPhotos]);
    
    // Remove scripts anteriores
    const existingScripts = document.querySelectorAll('script[src*="sincero.js"]');
    existingScripts.forEach(script => script.remove());
    
    // Limpa o widget anterior
    const widget = document.getElementById('_trustvox_widget');
    if (widget) {
      widget.innerHTML = '<p class="text-gray-500">Carregando avaliações...</p>';
    }
    
    // Carrega o script da Trustvox
    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = '//static.trustvox.com.br/sincero/sincero.js';
    script.onload = () => {
      console.log('Script Trustvox carregado para produto:', productId);
    };
    document.head.appendChild(script);
    
    // Debug
    console.log('Trustvox configurado:', {
      storeId,
      productId,
      productName,
      productPhotos: productPhotos.length
    });
  }, 100);
};

export default function TrustvoxWidget({ 
  page, 
  storeId = "125156", 
  title = "Avaliações do Produto",
  showOnlyWithProduct = true 
}: Props) {
  // Se não há página ou produto, não renderiza nada (se configurado)
  if (showOnlyWithProduct && (!page || !page.product)) {
    return null;
  }

  // Dados do produto para a Trustvox - Usa inProductGroupWithID (ID do produto na VTEX)
  const product = page?.product;
  const refId = product?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
  const vtexProductId = product?.inProductGroupWithID; // ID do produto na VTEX
  const productId = vtexProductId || refId || product?.sku || product?.productID || "";
  const productName = product?.name || "";
  const productPhotos = product?.image?.map(img => img.url) || [];

  // Debug no servidor
  console.log('TrustvoxWidget - Dados do produto:', {
    refId,
    vtexProductId,
    sku: product?.sku,
    productID: product?.productID,
    finalProductId: productId,
    productName,
    photosCount: productPhotos.length
  });

  return (
    <div class="w-full py-8">
      {title && (
        <div class="container mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      
      <div class="container">
        {/* Widget da Trustvox conforme documentação */}
        <div id="_trustvox_widget" class="min-h-[200px] border border-gray-200 p-4">
          <p class="text-gray-500">Carregando avaliações...</p>
        </div>
      </div>

      {/* Script do produto da Trustvox */}
      {productId && (
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: useScript(trustvoxProductScript, storeId, productId, productName, productPhotos),
          }}
        />
      )}
    </div>
  );
}