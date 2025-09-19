export interface Props {
  /**
   * @title ID da Loja Trustvox
   * @description Substitua pelo ID da sua loja na Trustvox
   */
  storeId: string;
  /**
   * @title Limite de opiniões
   * @description Número de opiniões a serem exibidas no carousel
   * @default 4
   */
  limit?: number;
  /**
   * @title Título da seção
   * @description Título opcional para a seção de opiniões
   */
  title?: string;
}

export default function TrustvoxCarousel({
  storeId = "ID-DA-LOJA",
  limit = 4,
  title = "O que nossos clientes dizem",
}: Props) {
  return (
    <>
      {/* Scripts da Trustvox - devem ser carregados antes da div */}
      <script type="text/javascript" src="//colt.trustvox.com.br/colt.min.js">
      </script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _trustvox_colt = _trustvox_colt || [];
            _trustvox_colt.push(['_storeId', '${storeId}'], ['_limit', '${limit}']);
          `,
        }}
      />

      <section class="py-8 bg-gray-50">
        <div class="container mx-auto px-4">
          {title && (
            <div class="text-center mb-8">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
                {title}
              </h2>
            </div>
          )}

          {/* Container do carousel da Trustvox */}
          <div id="_trustvox_colt" class="w-full min-h-[200px]"></div>
        </div>
      </section>
    </>
  );
}
