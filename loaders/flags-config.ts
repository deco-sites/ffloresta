import { ImageWidget } from "apps/admin/widgets.ts";

export interface Flag {
  title: string;
  collections: string[];
  type: "text" | "image";
  textColor?: string;
  backgroundColor?: string;
  image?: string;
}

export interface FlagText {
  /** @title Tipo da Flag */
  type: "text";
  /** @title Título da Flag */
  title?: string;
  /** @title Cor do Texto */
  /** @format color */
  textColor?: string;
  /** @title Cor de Fundo */
  /** @format color */
  backgroundColor?: string;
  /** @title Coleções */
  collections?: string[];
}

export interface FlagImage {
  /** @title Tipo da Flag */
  type: "image";
  /** @title Imagem */
  image?: ImageWidget;
  /** @title Coleções */
  collections?: string[];
}

export type FlagItem = FlagText | FlagImage;

export interface Props {
  /** @title Items de Configuração */
  items?: FlagItem[];
}

const FlagsConfigLoader = (props: Props): Flag[] => {
  const { items = [] } = props;

  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item, index) => {
    const base = {
      title: item.title || `Flag ${index + 1}`,
      collections: item.collections || [],
      type: item.type,
    };

    if (item.type === "text") {
      return {
        ...base,
        textColor: item.textColor || "#fff",
        backgroundColor: item.backgroundColor || "#3A4332",
      };
    } else {
      return {
        ...base,
        image: item.image,
      };
    }
  });
};

export default FlagsConfigLoader;
