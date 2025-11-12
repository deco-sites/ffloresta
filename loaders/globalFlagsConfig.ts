export interface TextFlag {
  /**
   * @title Tipo da Flag
   */
  type: "text";

  /**
   * @title Texto da Flag
   */
  text: string;

  /**
   * @title Cor de Fundo
   * @format color
   */
  backgroundColor: string;

  /**
   * @title Cor do Texto
   * @format color
   */
  textColor: string;

  /**
   * @title IDs de Coleção
   */
  collectionIds: string[];
}

export interface ImageFlag {
  /**
   * @title Tipo da Flag
   */
  type: "image";

  /**
   * @title Texto Alternativo
   */
  altText: string;

  /**
   * @title Imagem da Flag
   * @format image-uri
   */
  image: string;

  /**
   * @title IDs de Coleção
   */
  collectionIds: string[];
}

/**
 * @title Flag
 */
export type Flag = TextFlag | ImageFlag;

/**
 * @title Configuração de Flags
 * @description Configure as flags para produtos
 */
export interface Props {
  /**
   * @title Flags de Coleção
   */
  flags?: Flag[];
}

// IMPORTANTE: Retorna Flag[] para poder ser usado em outros componentes
export default function FlagsConfigLoader(props: Props): Flag[] {
  return props.flags || [];
}
