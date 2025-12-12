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
      <div className="bg-white w-full flex items-center rounded-lg border border-[#EAE6E6] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] px-4 py-2 relative">
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
            width="54"
            height="54"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect opacity="0.9" width="54" height="54" rx="3" fill="#1F251C" />
            <circle cx="26.7466" cy="26.7466" r="17.7466" fill="white" />
            <rect
              x="15.0845"
              y="18.1267"
              width="21.2959"
              height="4.05636"
              fill="#1F251C"
            />
            <rect
              x="28.2678"
              y="19.1409"
              width="17.2395"
              height="4.05636"
              transform="rotate(90 28.2678 19.1409)"
              fill="#1F251C"
            />
            <rect
              x="18.1269"
              y="25.2253"
              width="16.2254"
              height="4.05636"
              fill="#1F251C"
            />
          </svg>
        </div>

        <div className="text-center min-w-[160px]">
          <p className="text-sm text-gray-700">
            Só no app você aproveita
            <br />
            Ofertas <strong className="font-bold">EXCLUSIVAS</strong>
          </p>
        </div>

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-[170px] bg-[#3A4332] hover:bg-[#2c3325] text-white text-center font-medium py-2.5 px-0 rounded-lg transition-colors duration-200"
        >
          BAIXE AGORA
        </a>
      </div>
    </div>
  );
};

export default DownloadAppLink;
