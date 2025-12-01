export default function NotFound() {
  return (
    <div className="container w-full flex justify-center items-center py-2 mt-20">
      <div className="mb-8">
        <div className="max-w-container w-full mx-auto px-4 flex flex-col items-center justify-center text-center py-12">
          <h1 className="text-[25px] leading-[25px] font-bold mb-6 uppercase">
            Oops! <br /> O item que você buscou não foi encontrado!
          </h1>
          <h2 className="uppercase mb-3">
            Mas não se preocupe, tente novamente utilizando nossas dicas:
          </h2>
          <ul className="mb-5">
            <li className="text-[13px] leading-[13px]">
              <span className="text-lg inline-block mr-1">•</span>{" "}
              Verifique se não há erro de digitação.
            </li>
            <li className="text-[13px] leading-[13px]">
              <span className="text-lg inline-block mr-1">•</span>{" "}
              Tente utilizar uma única palavra.
            </li>
            <li className="text-[13px] leading-[13px]">
              <span className="text-lg inline-block mr-1">•</span>{" "}
              Tente buscar por termos menos específicos e posteriormente use os
              filtros da busca.
            </li>
            <li className="text-[13px] leading-[13px]">
              <span className="text-lg inline-block mr-1">•</span>{" "}
              Procure utilizar sinônimos ao termo desejado.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
