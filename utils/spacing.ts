/**
 * @title Configurações de Espaçamento
 * @description Controle de margins e paddings para componentes
 */
export interface SpacingProps {
  /**
   * @title Margem Externa
   * @description Espaçamento ao redor do componente
   */
  margin?: {
    /**
     * @title Margem Superior
     * @description Espaço acima do componente (em pixels)
     * @default 0
     */
    top?: number;
    /**
     * @title Margem Inferior
     * @description Espaço abaixo do componente (em pixels)
     * @default 0
     */
    bottom?: number;
    /**
     * @title Margem Esquerda
     * @description Espaço à esquerda do componente (em pixels)
     * @default 0
     */
    left?: number;
    /**
     * @title Margem Direita
     * @description Espaço à direita do componente (em pixels)
     * @default 0
     */
    right?: number;
  };

  /**
   * @title Padding Interno
   * @description Espaçamento dentro do componente
   */
  padding?: {
    /**
     * @title Padding Superior
     * @description Espaço interno acima do conteúdo (em pixels)
     * @default 0
     */
    top?: number;
    /**
     * @title Padding Inferior
     * @description Espaço interno abaixo do conteúdo (em pixels)
     * @default 0
     */
    bottom?: number;
    /**
     * @title Padding Esquerdo
     * @description Espaço interno à esquerda do conteúdo (em pixels)
     * @default 0
     */
    left?: number;
    /**
     * @title Padding Direito
     * @description Espaço interno à direita do conteúdo (em pixels)
     * @default 0
     */
    right?: number;
  };
}

/**
 * @title Função para converter SpacingProps em CSS
 * @description Transforma as configurações de espaçamento em um objeto de estilo
 */
export function spacingToStyle(spacing?: SpacingProps): React.CSSProperties {
  if (!spacing) return {};

  return {
    ...(spacing.margin && {
      marginTop: spacing.margin.top ? `${spacing.margin.top}px` : undefined,
      marginBottom: spacing.margin.bottom
        ? `${spacing.margin.bottom}px`
        : undefined,
      marginLeft: spacing.margin.left ? `${spacing.margin.left}px` : undefined,
      marginRight: spacing.margin.right
        ? `${spacing.margin.right}px`
        : undefined,
    }),
    ...(spacing.padding && {
      paddingTop: spacing.padding.top ? `${spacing.padding.top}px` : undefined,
      paddingBottom: spacing.padding.bottom
        ? `${spacing.padding.bottom}px`
        : undefined,
      paddingLeft: spacing.padding.left
        ? `${spacing.padding.left}px`
        : undefined,
      paddingRight: spacing.padding.right
        ? `${spacing.padding.right}px`
        : undefined,
    }),
  };
}
