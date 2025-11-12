export interface Flag {
  title: string;
  collections: string[];
}

export interface FlagItem {
  /** @title Título da Flag */
  title?: string;
  /** @title Coleções */
  collections?: string[];
}

export interface Props {
  /** @title Items de Configuração */
  items?: FlagItem[];
}

const FlagsConfigLoader = (props: Props): Flag[] => {
  const { items = [] } = props;

  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item, index) => ({
    title: item.title || `Flag ${index + 1}`,
    collections: item.collections || [],
  }));
};

export default FlagsConfigLoader;
