import { useEffect, useState } from "preact/hooks";

const DownloadAppLink: React.FC = () => {
  const [storeUrl, setStoreUrl] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isClosed, setIsClosed] = useState<boolean>(false);

  useEffect(() => {
    // Verificar se já foi fechado anteriormente (opcional, usando localStorage)
    const wasClosed = localStorage.getItem("appDownloadCardClosed");
    if (wasClosed === "true") {
      setIsClosed(true);
      return;
    }

    const userAgent = navigator.userAgent || navigator.vendor;

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setStoreUrl(
        "https://apps.apple.com/br/app/ferragens-floresta/id6753029448"
      );
    } else if (/android/i.test(userAgent)) {
      setStoreUrl(
        "https://play.google.com/store/apps/details?id=com.kobe.ferragensfloresta"
      );
    } else {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    // Opcional: salvar no localStorage para não mostrar novamente
    localStorage.setItem("appDownloadCardClosed", "true");
  };

  if (!isVisible || !storeUrl || isClosed) return null;

  return (
    <div className="fixed w-[calc(100vw-32px)] right-1/2 transform translate-x-1/2 top-[176px] z-50">
      <div className="bg-white w-full flex items-center rounded-lg border border-[#EAE6E6] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] p-2 relative">
        {/* Botão de fechar */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 z-10"
          aria-label="Fechar"
          title="Fechar"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-700"
          >
            <path
              d="M13 1L1 13M1 1L13 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Seu SVG aqui */}
        <div className="flex justify-center">
          <svg
            width="142"
            height="142"
            viewBox="0 0 142 142"
            class="max-h-[42px] max-w-[42px] mr-2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M120.988 120.983C148.664 93.3063 148.664 48.4339 120.988 20.7575C93.3114 -6.919 48.439 -6.919 20.7626 20.7575C-6.91389 48.4339 -6.91389 93.3063 20.7626 120.983C48.439 148.659 93.3114 148.659 120.988 120.983Z"
              fill="#657459"
            />
            <path
              d="M113.39 55.2402V42.9102H28.3501V55.2402H63.5301V72.9202H35.8801V85.0402H63.5301V113.39H78.2001V85.0402H105.85V72.9202H78.2001V55.2402H113.39Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="text-center min-w-[160px]">
          <p className="text-sm text-gray-700 text-left">
            Só no app você aproveita
            <br />
            <strong className="font-bold"> ofertas exclusivas</strong>
          </p>
        </div>

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-[170px] bg-[#3A4332] hover:bg-[#2c3325] text-white text-center font-bold py-2.5 px-0 rounded-lg transition-colors duration-200"
        >
          BAIXE AGORA
        </a>
      </div>
    </div>
  );
};

export default DownloadAppLink;
