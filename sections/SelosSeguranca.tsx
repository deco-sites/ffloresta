import { useScript } from "@deco/deco/hooks";

export interface Props {
  /**
   * @title Título da seção
   * @description Título opcional para a seção de selos
   */
  title?: string;

  /**
   * @title Exibir selo Trustvox
   * @description Ativa/desativa o selo de avaliações confiáveis do Reclame AQUI
   * @default true
   */
  showTrustvox?: boolean;

  /**
   * @title Alinhamento
   * @description Como alinhar os selos
   * @default "center"
   */
  alignment?: "left" | "center" | "right";

  /**
   * @title Espaçamento
   * @description Espaçamento vertical da seção
   * @default "normal"
   */
  spacing?: "small" | "normal" | "large";
}

// Script otimizado para evitar conflitos
const TRUSTVOX_SCRIPT = `
// Carrega o script do Trustvox apenas se não estiver já carregado
(function() {
  if (!document.querySelector('script[src*="certificate.trustvox.com.br"]')) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//certificate.trustvox.com.br/widget.js';
    script.async = true;
    document.head.appendChild(script);
  }
})();
`;

export default function SelosSeguranca({
  title,
  showTrustvox = true,
  alignment = "center",
  spacing = "normal",
}: Props) {
  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[alignment];

  const spacingClass = {
    small: "py-4",
    normal: "py-8",
    large: "py-12",
  }[spacing];

  return (
    <section class={`w-full ${spacingClass}`}>
      <div class="container mx-auto px-4">
        {title && (
          <h3 class="text-lg font-semibold text-center mb-6">
            {title}
          </h3>
        )}

        <div class={`flex flex-wrap items-center gap-6 ${alignmentClass}`}>
          {showTrustvox && (
            <div class="flex flex-col items-center">
              {/* Selo fixo do Trustvox */}
              <div
                data-trustvox-certificate-fixed="data-trustvox-certificate-fixed"
                class="min-h-[80px] flex items-center justify-center"
              >
                {/* Fallback enquanto carrega */}
                <div class="text-sm text-gray-500">
                  Carregando selo...
                </div>
              </div>
            </div>
          )}

          {/* Espaço para futuros selos */}
          {/* Você pode adicionar outros selos aqui no futuro */}
        </div>
      </div>

      {/* Script do Trustvox apenas se habilitado */}
      {showTrustvox && (
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: TRUSTVOX_SCRIPT }}
        />
      )}
    </section>
  );
}
