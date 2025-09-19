import { useScript } from "@deco/deco/hooks";

export interface Props {
  /** @title Store ID */
  storeId?: string;
  /** @title Widget Title */
  title?: string;
  /** @description Mostrar título */
  showTitle?: boolean;
  /** @description Classe CSS customizada */
  customClass?: string;
}

// Script do selo da Trustvox
const trustvoxSealScript = (storeId: string) => {
  // Inicializa o array _trustvox se não existir
  if (!window._trustvox) {
    window._trustvox = [];
  }
  
  // Configura o store ID
  window._trustvox.push(['_storeId', storeId]);
  
  // Carrega o script da Trustvox se ainda não foi carregado
  if (!document.querySelector('script[src*="trustvox.com.br"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = '//static.trustvox.com.br/sincero/sincero.js';
    document.head.appendChild(script);
  }
};

export default function TrustvoxSeal({ 
  storeId = "125156", 
  title = "Avaliações da Loja",
  showTitle = true,
  customClass = ""
}: Props) {
  return (
    <div class={`w-full py-4 ${customClass}`}>
      {showTitle && title && (
        <div class="container mb-4">
          <h2 class="text-xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      
      <div class="container">
        {/* Selo da Trustvox */}
        <div id="_trustvox_seal" class="flex justify-center"></div>
      </div>

      {/* Script da Trustvox */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(trustvoxSealScript, storeId),
        }}
      />
    </div>
  );
}