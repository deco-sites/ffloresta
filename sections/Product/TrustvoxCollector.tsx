import { useScript } from "@deco/deco/hooks";

export interface Props {
  /** @title Store ID */
  storeId?: string;
  /** @title Token */
  token?: string;
  /** @description Ativar coleta automática de avaliações */
  enableAutoCollection?: boolean;
}

// Script de coleta da Trustvox para pós-compra
const trustvoxCollectorScript = (storeId: string, token: string) => {
  // Inicializa o array _trustvox se não existir
  if (!window._trustvox) {
    window._trustvox = [];
  }
  
  // Configura os dados da loja
  window._trustvox.push(['_storeId', storeId]);
  window._trustvox.push(['_token', token]);
  
  // Carrega o script da Trustvox se ainda não foi carregado
  if (!document.querySelector('script[src*="trustvox.com.br"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = '//static.trustvox.com.br/sincero/sincero.js';
    document.head.appendChild(script);
  }
};

export default function TrustvoxCollector({ 
  storeId = "125156", 
  token = "-rpq7za52MCEnduJmBm4",
  enableAutoCollection = true
}: Props) {
  // Se a coleta automática não estiver habilitada, não renderiza nada
  if (!enableAutoCollection) {
    return null;
  }

  return (
    <>
      {/* Script de coleta da Trustvox */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(trustvoxCollectorScript, storeId, token),
        }}
      />
    </>
  );
}