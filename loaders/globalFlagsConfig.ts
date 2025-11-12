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
   * @description IDs das coleções que irão exibir esta flag
   */
  collectionIds: string[];
}

export interface ImageFlag {
  /**
   * @title Texto Alternativo
   * @description Texto que aparece quando a imagem não carrega
   */
  altText: string;
  /**
   * @title Imagem da Flag
   * @format image-uri
   */
  image: string;
  /**
   * @title IDs de Coleção
   * @description IDs das coleções que irão exibir esta flag
   */
  collectionIds: string[];
}

export type Flag = TextFlag | ImageFlag;

export interface Props {
  /**
   * @title Flags de Coleção
   */
  flags?: Flag[];
}

/**
 * @title Loader de Flags de Coleção
 * @description Gerencia flags para produtos baseado em IDs de coleção - suporta texto com cores ou imagem
 */
const FlagsConfigLoader = ({ flags = [] }: Props): Flag[] => {
  return flags;
};

export default FlagsConfigLoader;
