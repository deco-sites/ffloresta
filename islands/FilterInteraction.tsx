import { useEffect } from "preact/hooks";

interface Props {
  url: string;
}

export default function FilterInteraction({ url }: Props) {
  useEffect(() => {
    // Função para atualizar o estado visual dos filtros
    const updateFilterStates = () => {
      // Garantir que os filtros mantenham o estado visual correto
      const selectedCheckboxes = document.querySelectorAll(
        '.checkbox[data-selected="true"]',
      );
      selectedCheckboxes.forEach((checkbox) => {
        checkbox.classList.add("bg-[#1F251C]", "border-[#1F251C]");
        checkbox.classList.remove("border-[#CCCCCC]", "bg-white");
      });

      const unselectedCheckboxes = document.querySelectorAll(
        '.checkbox[data-selected="false"]',
      );
      unselectedCheckboxes.forEach((checkbox) => {
        checkbox.classList.remove("bg-[#1F251C]", "border-[#1F251C]");
        checkbox.classList.add("border-[#CCCCCC]", "bg-white");
      });
    };

    // Executar imediatamente
    updateFilterStates();

    // Aguardar o DOM estar completamente carregado e executar novamente
    const timer = setTimeout(updateFilterStates, 100);

    // Observar mudanças no DOM para reagir a atualizações HTMX
    const observer = new MutationObserver(() => {
      updateFilterStates();
    });

    // Observar mudanças no container de filtros
    const filtersContainer =
      document.querySelector("[data-filters-container]") || document.body;
    observer.observe(filtersContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-selected"],
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [url]);

  return null;
}
