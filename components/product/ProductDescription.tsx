import { useId } from "preact/hooks";

interface TabContent {
  title: string;
  content: preact.ComponentChildren;
}

interface Props {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs: TabContent[];
}

function ProductDescription({
  activeTab = "Galeria",
  onTabChange,
  tabs,
}: Props) {
  const id = useId();
  const currentTab = tabs.find((tab) => tab.title === activeTab) || tabs[0];

  return (
    <div class="bg-[#E3E7DE] w-full" id={id}>
      {/* Header vazio */}
      <div class="w-full h-12 bg-[#96A27E]"></div>

      {/* Container principal */}
      <div class="container mx-auto py-9 md:py-10">
        {/* Tabs */}
        <div class="flex overflow-x-auto gap-8 md:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.title}
              class={`font-normal text-sm leading-[170%] text-[#3A4332] whitespace-nowrap p-0 m-0 ${
                activeTab === tab.title
                  ? "font-bold border-b border-[#9AA192]"
                  : ""
              }`}
              onClick={() => onTabChange?.(tab.title)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Conteúdo da tab ativa */}
        <div class="mt-6">{currentTab.content}</div>
      </div>
    </div>
  );
}

export default ProductDescription;
