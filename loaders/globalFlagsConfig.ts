// loaders/flagsCollection.ts

export interface Flag {
  /**
   * @title Texto da Flag
   */
  text: string;
  /**
   * @title IDs de Coleção
   * @description IDs das coleções que irão exibir esta flag
   */
  collectionIds: string[];
  /**
   * @title Imagem da Flag
   * @format image-uri
   */
  image: string;
}

export interface Props {
  /**
   * @title Flags de Coleção
   */
  flags?: Flag[];
}

/**
 * @title Loader de Flags de Coleção
 * @description Gerencia flags para produtos baseado em IDs de coleção
 */
const FlagsConfigLoader = ({ flags = [] }: Props) => {
  return flags;
};

export default FlagsConfigLoader;
