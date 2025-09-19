export interface Props {
  /**
   * @title Exibir selo fixo
   * @description Se habilitado, exibe o selo fixo da Trustvox no local onde a seção for adicionada
   * @default true
   */
  showFixedSeal?: boolean;
  
  /**
   * @title Classe CSS personalizada
   * @description Classes CSS adicionais para personalizar o estilo do selo
   */
  customClass?: string;
}

export default function TrustvoxCertificate({ 
  showFixedSeal = true,
  customClass = ""
}: Props) {
  if (!showFixedSeal) {
    return null;
  }

  return (
    <div class={`trustvox-certificate-container ${customClass}`}>
      {/* Trustvox - Selo fixo de Avaliações Confiáveis */}
      <div data-trustvox-certificate-fixed="data-trustvox-certificate-fixed"></div>
    </div>
  );
}