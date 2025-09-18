import { useDevice } from "@deco/deco/hooks";
import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";
import Newsletter from "../../islands/Newsletter.tsx";

/** @titleBy title */
interface Item {
  title: string;
  href: string;
}

/** @titleBy title */
interface Link extends Item {
  itens: Item[];
}

/** @titleBy alt */
interface SocialItem {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

/** @titleBy title */
interface Social {
  title: string;
  itens: SocialItem[];
}

/** @titleBy alt */
interface PaymentMethodsItem {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

/** @titleBy title */
interface PaymentMethods {
  title: string;
  payments: PaymentMethodsItem[];
}

/** @titleBy title */
interface LojasItens {
  title: string;
  tuor: string;
  end: string;
  tel: string;
  horario: string;
  tourUrl?: string;
}

/** @titleBy title */
interface Lojas {
  title: string;
  lojas: LojasItens[];
}

interface Props {
  links?: Link[];
  social?: Social[];
  paymentMethods?: PaymentMethods[];
  policies?: Item[];
  logo?: ImageWidget;
  logoLinha?: ImageWidget;
  trademark?: string;
  lojas?: Lojas;
  whatsAppLink?: string;
}

function Footer({
  links = [],
  social = [],
  paymentMethods = [],
  logo,
  logoLinha,
  trademark,
  lojas = { title: "", lojas: [] },
  whatsAppLink = "https://api.whatsapp.com/send?phone=551130936121&text=Ol%C3%A1,%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es",
}: Props) {
  const device = useDevice();
  const isMobile = device === "mobile";

  return (
    <>
      <footer class="sm:px-0 mt-5 sm:mt-10" style={{ backgroundColor: "#fff" }}>
        <Newsletter />

        {!isMobile && (
          <div class="bg-[#1F251C] min-h-[100px] flex items-center ps-[4%]">
            <div class="w-full">
              {logoLinha && (
                <Image
                  src={logoLinha}
                  alt="Logo Linha"
                  loading="lazy"
                  width={200}
                  height={50}
                />
              )}
            </div>
          </div>
        )}

        <div class="w-full bg-[#3A4332]">
          <div class="container flex flex-col lg:p-[4%] w-full p-5">
            <div class="w-full pb-[30px]">
              {logo && (
                <Image
                  src={logo}
                  alt="Logo"
                  loading="lazy"
                  class="max-w-[250px]"
                  width={isMobile ? 120 : 300}
                  height={100}
                />
              )}
            </div>

            <div class="flex flex-col sm:grid sm:grid-flow-row lg:grid-cols-2 gap-6">
              {isMobile ? (
                <div>
                  {links.map(({ title, itens }, index) => (
                    <AccordionItem key={title + index} title={title}>
                      <div class="flex flex-col gap-[12px] mt-2 mb-[20px]">
                        {itens.map(({ title, href }, idx) => (
                          <a
                            key={title + idx}
                            class="font-normal text-[14px] text-white"
                            href={href}
                          >
                            {title}
                          </a>
                        ))}
                      </div>
                    </AccordionItem>
                  ))}
                </div>
              ) : (
                <div class="grid grid-flow-row sm:grid-flow-col gap-6">
                  {links.map(({ title, itens }, index) => (
                    <div key={title + index} class="flex flex-col gap-[18px]">
                      <SectionTitle title={title} />
                      <div class="flex flex-col gap-[18px]">
                        {itens.map(({ title, href }, idx) => (
                          <a
                            key={title + idx}
                            class="font-normal text-[14px] text-white"
                            href={href}
                          >
                            {title}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div class="flex flex-col sm:flex-row gap-12 justify-between items-start">
                <div class="w-full">
                  {social.map(({ title, itens }, index) => (
                    <div class="w-full" key={title + index}>
                      <SectionTitle title={title} showDivider={!isMobile} />
                      <div class="flex items-center lg:flex-col gap-[15px] lg:max-w-[210px] mt-[20px]">
                        {itens.length > 0 && (
                          <a
                            href={itens[0].href}
                            class="w-full max-w-[50%] min-w-[50%]"
                          >
                            <Image
                              src={itens[0].image}
                              alt={itens[0].alt}
                              loading="lazy"
                              width="100%"
                              height="auto"
                              class="w-full"
                            />
                          </a>
                        )}

                        {itens.length > 1 && (
                          <div class="grid grid-cols-3 gap-[10px]">
                            {itens.slice(1).map(({ image, alt, href }, idx) => (
                              <a key={idx} href={href} class="">
                                <Image
                                  src={image}
                                  alt={alt}
                                  loading="lazy"
                                  width={50}
                                  height={50}
                                  class="w-full h-auto max-w-[50px] max-h-[50px]"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div class="flex flex-wrap gap-2">
                  {paymentMethods.map(({ title, payments }, index) => (
                    <div key={title + index}>
                      <SectionTitle title={title} showDivider={!isMobile} />
                      <div class="flex flex-wrap max-w-[300px] lg:max-w-[360px] mt-[20px]">
                        {payments.map(({ image, alt, href }, idx) => (
                          <a key={idx} href={href} class="mb-[15px] mr-[5px]">
                            <Image
                              src={image}
                              alt={alt}
                              loading="lazy"
                              width={isMobile ? 46 : 65}
                              height={isMobile ? 32 : 44}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seção de Lojas com dropdown apenas no mobile */}
            <div>
              {isMobile ? (
                <div class="mt-6">
                  <details class="group">
                    <summary class="font-bold text-[16px] text-white cursor-pointer flex justify-between items-center min-h-[48px] list-none">
                      <span>{lojas.title}</span>
                      <svg
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="transform group-open:rotate-180 transition-transform duration-300"
                      >
                        <path
                          d="M0.52124 0.966797C0.537437 0.755898 0.622525 0.570573 0.775146 0.417969L0.842529 0.357422C1.00278 0.224673 1.19303 0.157278 1.40796 0.157227C1.62312 0.157227 1.814 0.224465 1.97436 0.357422L2.04077 0.417969L6.00757 4.38574L9.97534 0.417968L10.0408 0.359375C10.1973 0.230598 10.3865 0.165388 10.6013 0.162109L10.6931 0.165039C10.8737 0.17901 11.0351 0.24329 11.1736 0.357421L11.241 0.417968C11.4141 0.591095 11.5026 0.805113 11.5027 1.05078C11.5027 1.26578 11.4353 1.45689 11.3025 1.61719L11.241 1.68457L6.74683 6.17871C6.66749 6.25802 6.58242 6.32291 6.49097 6.37012L6.39722 6.41113C6.27539 6.45627 6.14515 6.47848 6.00854 6.47852C5.87192 6.47852 5.74172 6.45623 5.61987 6.41113L5.52612 6.37012C5.43441 6.32286 5.34882 6.25824 5.26929 6.17871L0.775146 1.68457L0.716553 1.61914C0.587624 1.46258 0.522622 1.27346 0.519287 1.05859L0.52124 0.966797Z"
                          fill="#ffffff"
                          stroke="white"
                          stroke-width="0.3"
                        />
                      </svg>
                    </summary>
                    <div class="flex flex-col gap-y-[10px] mt-4">
                      {lojas.lojas.map((loja, idx) => (
                        <div key={idx} class="mb-4">
                          <p class="text-white text-[14px]">{loja.title}</p>
                          {loja.tourUrl ? (
                            <a
                              href={loja.tourUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="text-white text-[12px] font-bold underline hover:text-gray-300 transition-colors"
                            >
                              {loja.tuor}
                            </a>
                          ) : (
                            <p class="text-white text-[12px] font-bold underline">
                              {loja.tuor}
                            </p>
                          )}
                          <p class="text-white text-[12px]">{loja.end}</p>
                          <div class="flex flex-row flex-wrap">
                            <p class="text-white text-[12px] font-bold">
                              TELEFONE:
                            </p>
                            <p class="text-white text-[12px] ml-1">
                              {loja.tel}
                            </p>
                          </div>
                          <div>
                            <p class="text-white text-[12px] font-bold underline">
                              HORÁRIO DE ATENDIMENTO
                            </p>
                            <p class="text-white text-[12px]">{loja.horario}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              ) : (
                <>
                  <p class="font-bold text-[16px] text-white mb-[30px] mt-[50px]">
                    {lojas.title}
                  </p>
                  <div class="grid grid-cols-1 lg:grid-cols-5 gap-x-[20px]">
                    {lojas.lojas.map((loja, idx) => (
                      <div key={idx} class="flex flex-col gap-y-[10px] mb-6">
                        <p class="text-white text-[16px]">{loja.title}</p>
                        {loja.tourUrl ? (
                          <a
                            href={loja.tourUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-white text-[14px] font-bold underline hover:text-gray-300 transition-colors"
                          >
                            {loja.tuor}
                          </a>
                        ) : (
                          <p class="text-white text-[14px] font-bold underline">
                            {loja.tuor}
                          </p>
                        )}
                        <p class="text-white text-[14px] min-h-[64px]">
                          {loja.end}
                        </p>
                        <div class="flex flex-row flex-wrap">
                          <p class="text-white text-[14px] font-bold">
                            TELEFONE:
                          </p>
                          <p class="text-white text-[14px] ml-1">{loja.tel}</p>
                        </div>
                        <div>
                          <p class="text-white text-[14px] font-bold underline">
                            HORÁRIO DE ATENDIMENTO
                          </p>
                          <p class="text-white text-[14px]">{loja.horario}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {!isMobile && (
              <hr class="w-full text-base-400 mt-[50px] bg-[#A3A3A3] h-[2px]" />
            )}

            <div class="flex flex-col lg:flex-row items-center justify-between mt-[30px] lg:mt-4">
              <div class="flex flex-nowrap items-center justify-between sm:justify-center gap-4">
                <span class="text-xs font-normal text-center lg:text-start text-base-400 text-white">
                  {trademark}
                </span>
              </div>

              <div class="flex flex-row items-start gap-4 mt-4 lg:mt-0">
                <div class="flex flex-col items-center justify-center gap-4">
                  <span class="text-sm font-normal text-white">Powered by</span>
                  <svg
                    width="69"
                    height="25"
                    viewBox="0 0 69 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.6174 0.579286C3.94726 0.85472 3.26099 1.83964 3.26099 2.52577C3.26099 2.85898 3.78653 4.13554 4.42883 5.36226C5.07116 6.58898 5.59669 7.64323 5.59669 7.70518C5.59669 7.76685 4.5934 7.81746 3.36717 7.81746C1.42069 7.81746 1.08371 7.87146 0.712974 8.24278C0.4794 8.47673 0.2883 8.82283 0.2883 9.0119C0.2883 9.57207 7.52554 23.1249 7.9447 23.3497C8.99741 23.914 9.75294 23.2385 10.993 20.6244C11.3332 19.907 11.6869 19.3669 11.779 19.4239C11.8712 19.4808 12.4914 20.578 13.1575 21.8622C13.8236 23.1461 14.4934 24.3004 14.6458 24.4272C14.798 24.5537 15.3068 24.709 15.776 24.7721C17.3963 24.9897 16.8245 25.8774 24.998 10.4574C27.2579 6.1941 28.9536 2.75379 28.9536 2.43221C28.9536 2.11062 28.6879 1.57129 28.3341 1.17456L27.7146 0.480002L16.3904 0.437442C10.1619 0.414076 4.86412 0.477869 4.6174 0.579286ZM53.2181 7.58604C51.2516 8.08989 50.9696 8.84678 51.0695 13.3546C51.1726 17.9935 51.4803 18.3304 55.4955 18.1985L57.5127 18.1325L57.5779 17.2286L57.6432 16.3246H55.7624C54.5829 16.3246 53.7869 16.2296 53.6268 16.0694C53.4868 15.9291 53.3721 15.3548 53.3721 14.7934V13.7724H55.3894H57.4065V12.8155V11.8584H55.3894H53.3721V11.0251C53.3721 9.54057 53.4046 9.51885 55.6244 9.51885H57.6189V8.56185C57.6189 7.65108 57.5895 7.60474 57.013 7.60474C56.6797 7.60474 55.8437 7.56121 55.1551 7.50779C54.4665 7.45438 53.5949 7.48967 53.2181 7.58604ZM17.162 8.0225C17.5279 8.42718 17.4611 8.58841 14.9866 13.2862C12.5799 17.8553 12.3974 18.1363 11.7928 18.1977C11.0727 18.2714 11.3174 18.6458 7.99926 12.3901C5.89332 8.41952 5.9362 8.54081 6.4509 8.02522C6.84522 7.63034 7.17286 7.60474 11.8277 7.60474C16.4844 7.60474 16.8075 7.63004 17.162 8.0225ZM31.2893 7.82492C31.2893 7.94592 31.883 10.1231 32.6087 12.6634C34.1244 17.9679 34.2853 18.2389 35.9219 18.2389C37.6274 18.2389 37.8194 17.9173 39.33 12.5285C40.0461 9.97365 40.6321 7.82065 40.6321 7.74406C40.6321 7.66747 40.1216 7.60474 39.4975 7.60474H38.363L37.5673 10.5291C36.2588 15.3393 36.1505 15.6865 35.9597 15.6865C35.8594 15.6865 35.7257 15.5193 35.6632 15.3143C35.4411 14.5881 33.625 7.81154 33.625 7.70897C33.625 7.65158 33.0994 7.60474 32.4571 7.60474C31.7939 7.60474 31.2893 7.69986 31.2893 7.82492ZM41.906 8.56185V9.51885H43.2817H44.6577L44.715 13.8257L44.7725 18.1325L45.8872 18.1967L47.002 18.2611V13.8899V9.51885H48.3823H49.7624V8.56185V7.60474H45.8343H41.906V8.56185ZM59.5573 8.40236C59.8248 8.84106 60.5558 9.99895 61.1819 10.9755L62.3197 12.7512L60.7875 15.3356C59.945 16.7569 59.2161 17.9916 59.1678 18.0792C59.1196 18.1669 59.6462 18.2389 60.338 18.2389H61.596L62.6002 16.5074L63.6048 14.7757L64.5242 16.2416C65.0298 17.0475 65.5224 17.8323 65.6185 17.9855C65.7404 18.1794 66.1995 18.2441 67.129 18.1983L68.4642 18.1325L67.3273 16.3246C66.7019 15.3304 65.9435 14.1278 65.6422 13.6517L65.0941 12.7867L66.665 10.2922C67.5287 8.92018 68.2356 7.75424 68.2356 7.70111C68.2356 7.64818 67.6857 7.60474 67.0134 7.60474H65.7914L64.8369 9.17923C64.3121 10.0453 63.8231 10.7169 63.7503 10.6721C63.6775 10.6272 63.2126 9.91848 62.7172 9.09759L61.8169 7.60474H60.4437H59.0706L59.5573 8.40236Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div class="flex flex-col items-center justify-center gap-4">
                  <span class="text-sm font-normal text-base-400 text-white">
                    Developed by
                  </span>
                  <a href="https://agenciaalmah.com.br/">
                    <svg
                      width="857"
                      height="264"
                      viewBox="0 0 857 264"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="max-w-[97px] max-h-[24px]"
                    >
                      <path
                        d="M257.4 230.5C255.8 227.5 253.4 225.5 250.5 224.4C248 223.6 245.1 223.2 241.8 223.2C237.9 223.2 234.6 222.7 231.9 221.9C229.5 221.2 227.6 219.9 226 218.1C224.4 216.2 223.1 213.7 222.3 210.8C221.5 207.7 221.1 203.9 221.1 199.5V20.2C221.1 16.5 220.6 13.2 219.8 10.5C218.8 7.1 216.6 4.40005 213.4 2.80005C210.5 1.20005 206.5 0.5 201 0.5C195.7 0.5 191.8 1.3 188.9 3C185.7 4.8 183.6 7.50005 182.6 10.8C181.8 13.6 181.4 16.8999 181.4 20.8999V199.9C181.4 208.7 182.1 216.6 183.6 223.3C185.1 230.1 187.5 236.2 190.7 241.2C194 246.3 198.1 250.5 203 253.6C207.8 256.8 213.6 259 220.3 260.3C226.8 261.5 234 262.1 241.8 262.1C245 262.1 247.9 261.8 250.3 261.1C253.4 260.2 255.8 258.1 257.5 254.9C259 252 259.7 247.9 259.7 242.5C259.7 237.2 259 233.3 257.4 230.5Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M534.5 167.2V242C534.5 245.9 534.1 249.3 533.2 252.1C532.1 255.8 529.9 258.6 526.6 260.6C523.6 262.5 519.3 263.4 513.5 263.4C508 263.4 503.7 262.4 500.5 260.5C496.9 258.3 494.5 255.2 493.6 251.5C492.9 248.7 492.6 245.5 492.6 241.7V166.9C492.6 157 491.3 148.3 488.9 141C486.6 134 483.3 128.7 479 125C474.9 121.5 469.6 119.8 462.7 119.8C455.1 119.8 448.6 121.7 442.9 125.4C437.1 129.2 432.7 134.4 429.5 141.3C426.3 148.3 424.6 156.9 424.6 166.9V242.4C424.6 246.8 423.7 250.8 421.9 254.2C419.8 258 416.7 260.6 412.7 262.1C410.4 263 407.7 263.4 404.9 263.4C403.167 263.4 401.367 263.267 399.5 263C394.9 262.6 391.3 261.4 388.6 259.2C385.7 256.8 383.9 253.9 383.1 250.5C382.6 247.9 382.3 244.9 382.3 241.7V166.9C382.3 157 381.1 148.2 378.8 140.9C376.6 134 373.3 128.7 369 125.1C364.8 121.5 359.4 119.8 352.5 119.8C344.9 119.8 338.4 121.7 332.7 125.6C326.9 129.5 322.5 134.8 319.3 141.8C316 149 314.4 157.4 314.4 166.9V242C314.4 245.9 314 249.3 313.1 252.1C312 255.8 309.6 258.7 306.2 260.7C303.1 262.5 298.8 263.4 293.1 263.4C287.4 263.4 283.2 262.4 280.1 260.3C277 258.2 274.8 255.3 273.7 251.8C272.9 248.9 272.4 245.5 272.4 241.7V99.8999C272.4 96.2999 272.9 93.1 273.7 90.3C274.9 86.7 277.3 83.9001 280.8 82.1001C283.8 80.5001 288 79.7 293.4 79.7C300 79.7 304.9 81.1 308.2 84C311.3 86.8 313 91.1 313.3 96.7C316.3 93.9 319.7 91.3 323.4 89C328.4 86 333.8 83.5 339.4 81.7C345.2 79.9 351.1 79 357.1 79C366.2 79 374.4 80.5999 381.7 83.8999C388.8 87.0999 395.3 91.8 401 97.8C404.7 101.7 408.1 106.2 411 111.3C414.5 106.3 418.1 101.8 421.9 97.8999C427.7 91.7999 434.4 87.0999 441.8 83.8999C449.3 80.5999 457.7 79 467 79C481.9 79 494.6 82.7 504.7 90.2C514.6 97.6 522.2 108 527.2 121.2C532.1 134 534.5 149.5 534.5 167.2ZM404.9 258.2C405.033 258.2 405.167 258.2 405.3 258.2C405.1 258.2 404.933 258.2 404.8 258.2C404.8 258.2 404.833 258.2 404.9 258.2Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M114.1 246.7C102.9 256.7 86.2 263.4 66.1 263.4C27.7 263.4 0.5 240 0.5 206.8C0.5 174.8 23.9 152 71.6 149C89.9 147.9 100 145.3 105.2 140.8V132.6C105.2 116.2 94.4 105.4 77.6 105.4C64.6 105.4 56.7 111.4 54.1 120.3C51.1 129.7 43.7 135.6 33.6 135.6C19.5 135.6 13.5 124.1 13.5 115.9C13.5 108 16.9 102.5 22.1 96.5C31 84.9 49.7 73.3999 77.2 73.3999C120.8 73.3999 147.7 96.9 147.7 139.7V215C147.7 218.7 148 219.8 149.5 219.8C150.6 219.8 152.1 219.1 154.7 219.1C165.9 219.1 172.6 227.7 172.6 237.4C172.6 250 161.5 260.5 142.8 260.5C131.6 260.5 120.8 256 114.1 246.7ZM105.2 219.5V172.1C98.1 175.9 88 178.8 72.4 180C54.1 181.5 43.7 191.9 43.7 205.7C43.7 219.8 55.6 230.7 73.5 230.7C88 230.7 98.1 226.2 105.2 219.5Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M856.3 237.922C856.3 249.522 845.8 259.022 829.4 259.022C809 259.022 793 243.322 793 219.822C793 191.222 807.3 170.122 807.3 144.522C807.3 130.922 797.4 120.722 783.8 120.722C763.7 120.722 748.3 138.022 741.8 174.522L735 215.422C734 221.922 732.1 233.022 731.2 238.122C729.9 246.422 715.8 258.822 703.3 262.622C709 258.622 712.8 252.022 712.8 244.522C712.8 232.322 702.9 222.422 690.7 222.422C678.5 222.422 668.6 232.322 668.6 244.522C668.6 251.522 672 257.822 677.1 261.822C667.2 258.122 660.2 249.722 657.8 246.422C646.8 256.322 630.2 263.022 610.3 263.022C572.3 263.022 545.4 239.722 545.4 206.922C545.4 175.222 568.6 152.722 615.8 149.822C633.9 148.722 643.8 146.122 649 141.722V133.622C649 117.422 638.3 106.722 621.7 106.722C608.8 106.722 601.1 112.622 598.5 121.422C595.6 130.622 588.2 136.522 578.2 136.522C564.2 136.522 558.3 125.122 558.3 117.022C558.3 109.222 561.6 103.722 566.8 97.8222C575.6 86.4222 594.1 75.0221 621.4 75.0221C641.6 75.0221 653.1 77.122 662.8 82.622C674.8 89.522 678.3 94.3221 685.9 111.222C695.3 132.222 692.5 205.522 692.5 205.522C692.5 205.522 717.3 72.3221 717.3 67.0221C717.3 55.4221 718.8 46.7222 711.4 38.8222C706.9 34.0222 697.3 27.1221 700.7 15.7221C704.6 3.0221 714.5 1.922 730.7 3.622C743.5 5.022 761.3 22.5222 761.3 48.8222C761.3 54.6222 760.2 63.1221 759.2 68.2221L752.1 108.122C763 95.422 776.9 87.9221 793.3 87.9221C828.1 87.9221 846.8 112.822 846.8 142.122C846.8 169.122 830.4 196.022 830.4 218.122C830.4 221.522 831.8 222.622 833.2 222.622C835.2 222.622 836.6 221.522 840 221.522C849.2 221.522 856.3 228.722 856.3 237.922ZM649 172.622C642 176.322 632 179.322 616.6 180.422C598.5 181.922 588.2 192.222 588.2 205.822C588.2 219.822 600 230.522 617.7 230.522C632 230.522 642 226.122 649 219.522V172.622Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// Componente Auxiliar para Títulos de Seção
const SectionTitle = ({
  title,
  showDivider = true,
}: {
  title: string;
  showDivider?: boolean;
}) => (
  <div class="font-normal text-[16px] text-white mb-2">
    <p>{title}</p>
    {showDivider && (
      <hr class="w-full max-w-[75px] h-1 bg-[#273D28] rounded-sm mt-1" />
    )}
  </div>
);

// Componente Auxiliar para Itens de Acordeão (usado apenas para links)
const AccordionItem = ({
  title,
  children,
  class: className = "",
}: {
  title: string;
  children: preact.ComponentChildren;
  class?: string;
}) => (
  <details open class={`flex flex-col gap-[12px] ${className}`}>
    <summary class="font-normal text-[16px] text-white cursor-pointer flex justify-between items-center min-h-[48px] list-none">
      <span>{title}</span>
      <svg
        width="12"
        height="7"
        viewBox="0 0 12 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="transform transition-transform duration-300"
      >
        <path
          d="M0.52124 0.966797C0.537437 0.755898 0.622525 0.570573 0.775146 0.417969L0.842529 0.357422C1.00278 0.224673 1.19303 0.157278 1.40796 0.157227C1.62312 0.157227 1.814 0.224465 1.97436 0.357422L2.04077 0.417969L6.00757 4.38574L9.97534 0.417968L10.0408 0.359375C10.1973 0.230598 10.3865 0.165388 10.6013 0.162109L10.6931 0.165039C10.8737 0.17901 11.0351 0.24329 11.1736 0.357421L11.241 0.417968C11.4141 0.591095 11.5026 0.805113 11.5027 1.05078C11.5027 1.26578 11.4353 1.45689 11.3025 1.61719L11.241 1.68457L6.74683 6.17871C6.66749 6.25802 6.58242 6.32291 6.49097 6.37012L6.39722 6.41113C6.27539 6.45627 6.14515 6.47848 6.00854 6.47852C5.87192 6.47852 5.74172 6.45623 5.61987 6.41113L5.52612 6.37012C5.43441 6.32286 5.34882 6.25824 5.26929 6.17871L0.775146 1.68457L0.716553 1.61914C0.587624 1.46258 0.522622 1.27346 0.519287 1.05859L0.52124 0.966797Z"
          fill="#ffffff"
          stroke="white"
          stroke-width="0.3"
        />
      </svg>
    </summary>
    {children}
  </details>
);

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
