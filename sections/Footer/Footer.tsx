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
}

/** @titleBy title */
interface Lojas {
  title: string;
  lojas: LojasItens[];
  verMais: string;
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
}

function Footer({
  links = [],
  social = [],
  paymentMethods = [],
  logo,
  logoLinha,
  trademark,
  lojas = { title: "", lojas: [], verMais: "/" },
}: Props) {
  const device = useDevice();

  return (
    <footer class="sm:px-0 mt-5 sm:mt-10" style={{ backgroundColor: "#fff" }}>
      <Newsletter />
      {device === "mobile" ? (
        ""
      ) : (
        <div class="bg-[#1F251C] min-h-[100px] flex items-center ps-[4%]">
          <div class=" w-full">
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

      <div class="container flex flex-col lg:p-[4%]  w-full p-5">
        <div class="w-full pb-[30px]">
          {logo && (
            <Image
              src={logo}
              alt="Logo"
              loading="lazy"
              class="max-w-[250px]"
              width={device === "mobile" ? 120 : 300}
              height={100}
            />
          )}
        </div>

        <div class="grid grid-flow-row sm:grid-flow-col gap-6">
          {device === "mobile" ? (
            <div>
              {links.map(({ title, itens }, index) => (
                <details
                  open
                  key={title + index}
                  class="flex flex-col gap-[12px]"
                >
                  <summary class="font-normal text-[16px] uppercase text-[#353535] cursor-pointer flex justify-between items-center min-h-[48px]">
                    <span>{title}</span>

                    <span class="transform transition-transform duration-300">
                      <svg
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.52124 0.966797C0.537437 0.755898 0.622525 0.570573 0.775146 0.417969L0.842529 0.357422C1.00278 0.224673 1.19303 0.157278 1.40796 0.157227C1.62312 0.157227 1.814 0.224465 1.97436 0.357422L2.04077 0.417969L6.00757 4.38574L9.97534 0.417968L10.0408 0.359375C10.1973 0.230598 10.3865 0.165388 10.6013 0.162109L10.6931 0.165039C10.8737 0.17901 11.0351 0.24329 11.1736 0.357421L11.241 0.417968C11.4141 0.591095 11.5026 0.805113 11.5027 1.05078C11.5027 1.26578 11.4353 1.45689 11.3025 1.61719L11.241 1.68457L6.74683 6.17871C6.66749 6.25802 6.58242 6.32291 6.49097 6.37012L6.39722 6.41113C6.27539 6.45627 6.14515 6.47848 6.00854 6.47852C5.87192 6.47852 5.74172 6.45623 5.61987 6.41113L5.52612 6.37012C5.43441 6.32286 5.34882 6.25824 5.26929 6.17871L0.775146 1.68457L0.716553 1.61914C0.587624 1.46258 0.522622 1.27346 0.519287 1.05859L0.52124 0.966797Z"
                          fill="#292929"
                          stroke="white"
                          stroke-width="0.3"
                        />
                      </svg>
                    </span>
                  </summary>

                  <div class="flex flex-col gap-[12px] mt-2 mb-[20px]">
                    {itens.map(({ title, href }, idx) => (
                      <a
                        key={title + idx}
                        class="font-normal text-[14px] uppercase text-[#353535]"
                        href={href}
                      >
                        {title}
                      </a>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div class="grid grid-flow-row sm:grid-flow-col gap-6">
              {links.map(({ title, itens }, index) => (
                <div key={title + index} class="flex flex-col gap-[18px]">
                  <div class="font-normal text-[22px] uppercase text-[#353535]">
                    <p>{title}</p>
                    <hr class="w-full max-w-[75px] h-1 bg-[#273D28] rounded-sm" />
                  </div>
                  <div class="flex flex-col gap-[18px]">
                    {itens.map(({ title, href }, idx) => (
                      <a
                        key={title + idx}
                        class="font-normal text-[20px] uppercase text-[#353535]"
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
            <div class="">
              {social.map(({ title, itens }, index) => (
                <div key={title + index}>
                  <div
                    class={`font-normal text-[16px] lg:text-[22px] uppercase text-[#353535]`}
                  >
                    <p>{title}</p>
                    {device === "mobile" ? (
                      ""
                    ) : (
                      <hr class="w-full max-w-[75px] h-1 bg-[#273D28] rounded-sm" />
                    )}
                  </div>
                  <div class="flex flex-col gap-[15px] max-w-[159px] lg:max-w-[210px] mt-[20px]">
                    {/* Primeira imagem (índice 0) */}
                    {itens.length > 0 && (
                      <a href={itens[0].href} class="w-full">
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

                    {/* Demais imagens (se houver) */}
                    {itens.length > 1 && (
                      <div class="grid grid-cols-3 gap-[10px] ">
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
                  <div class="font-normal text-[16px] lg:text-[22px] uppercase text-[#353535]">
                    <p>{title}</p>
                    {device === "mobile" ? (
                      ""
                    ) : (
                      <hr class="w-full max-w-[75px] h-1 bg-[#273D28] rounded-sm" />
                    )}
                  </div>
                  <div class="flex flex-wrap max-w-[300px] lg:max-w-[360px] mt-[20px]">
                    {payments.map(({ image, alt, href }, idx) => (
                      <a key={idx} href={href} class="mb-[15px] mr-[5px]">
                        <Image
                          src={image}
                          alt={alt}
                          loading="lazy"
                          width={device === "mobile" ? 46 : 65}
                          height={device === "mobile" ? 32 : 44}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p class="font-bold text-[16px] lg:text-[24px]  text-[#273D28] font-['FS_Emeric'] mb-[30px] mt-[50px]">
            {lojas.title}
          </p>
          <div class="flex flex-row gap-x-[20px]">
            {device === "mobile" ? (
              <div class="flex flex-col gap-y-[10px]">
                <p class="text-[#273D28] text-[14px] lg:text-[22px]">
                  {lojas.lojas[0].title}
                </p>
                <p class="text-[#273D28] text-[12px] lg:text-[16px] font-bold underline decoration-[#273D28]">
                  {lojas.lojas[0].tuor}
                </p>
                <p class="text-[#273D28] text-[12px] lg:text-[16px]">
                  {lojas.lojas[0].end}
                </p>
                <div class="flex flex-row">
                  <p class="text-[#273D28] text-[12px] lg:text-[16px] font-bold">
                    TELEFONE:
                  </p>
                  <p class="text-[#273D28] text-[12px] lg:text-[16px]">
                    {lojas.lojas[0].tel}
                  </p>
                </div>
                <div>
                  <p class="text-[#273D28] text-[12px] lg:text-[16px] font-bold underline decoration-[#273D28]">
                    HORÁRIO DE ATENDIMENTO
                  </p>
                  <p class="text-[#273D28] text-[12px] lg:text-[16px]">
                    {lojas.lojas[0].horario}
                  </p>
                </div>
              </div>
            ) : (
              <div class="flex flex-row gap-x-[20px]">
                {" "}
                {lojas.lojas.map(({ title, tuor, end, tel, horario }, idx) => (
                  <div key={idx} class="flex flex-col gap-y-[10px]">
                    <p class="text-[#273D28] text-[14px] lg:text-[22px]">
                      {title}
                    </p>
                    <p class="text-[#273D28] text-[12px] lg:text-[16px] font-bold underline decoration-[#273D28]">
                      {tuor}
                    </p>
                    <p class="text-[#273D28] text-[12px] lg:text-[16px]">
                      {end}
                    </p>
                    <div class="flex flex-row">
                      <p class="text-[#273D28] text-[12px] lg:text-[16px] font-bold">
                        TELEFONE:
                      </p>
                      <p class="text-[#273D28] text-[12px] lg:text-[16px]">
                        {tel}
                      </p>
                    </div>
                    <div>
                      <p class="text-[#273D28] text-[12px] lg:text-[16px] font-bold underline decoration-[#273D28]">
                        HORÁRIO DE ATENDIMENTO
                      </p>
                      <p class="text-[#273D28] text-[12px] lg:text-[16px]">
                        {horario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {device === "mobile" ? (
            <a
              href={lojas.verMais}
              class="text-[#273D28] underline decoration-[#273D28] text-[12px] mt-[16px]"
            >
              Ver mais lojas
            </a>
          ) : (
            ""
          )}
        </div>

        {device === "mobile" ? (
          ""
        ) : (
          <hr class="w-full text-base-400 mt-[50px] bg-[#A3A3A3] h-[2px]" />
        )}

        <div class="flex flex-col lg:flex-row items-center justify-between mt-[30px] lg:mt-4">
          <div class="flex flex-nowrap items-center justify-between sm:justify-center gap-4">
            <span class="text-xs font-normal text-center lg:text-start text-base-400 text-[#777777]">
              {trademark}
            </span>
          </div>

          <div class="flex flex-row items-start gap-4">
            <div class="flex flex-col items-center justify-center gap-4">
              <span class="text-sm font-normal text-[#777777]">Powered by</span>
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
                  fill="#AFAFAF"
                />
              </svg>
            </div>
            <div class="flex flex-col items-center justify-center gap-4">
              <span class="text-sm font-normal text-base-400 text-[#777777]">
                Developed by
              </span>
              <svg
                width="98"
                height="25"
                viewBox="0 0 98 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.560791"
                  y="0.552734"
                  width="97"
                  height="23.8615"
                  fill="url(#pattern0_654_910)"
                />
                <defs>
                  <pattern
                    id="pattern0_654_910"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlink:href="#image0_654_910"
                      transform="matrix(0.00332425 0 0 0.0135135 0.099428 0)"
                    />
                  </pattern>
                  <image
                    id="image0_654_910"
                    width="241"
                    height="74"
                    preserveAspectRatio="none"
                    xlink:href="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
