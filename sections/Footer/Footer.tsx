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

/** @titleBy alt */
interface SecuritySealsItem {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

/** @titleBy title */
interface SecuritySeals {
  title: string;
  seals?: SecuritySealsItem[];
  showTrustvox?: boolean;
  trustvoxAlignment?: "left" | "center" | "right";
}

interface Props {
  logo?: ImageWidget;
  logoLinha?: ImageWidget;
  trademark?: string;
  whatsAppLink?: string;
  email?: string;
  phone?: string;
  businessHours?: string;
  whatsappHours?: string;
  institutionalLinks?: Item[];
  policyLinks?: Item[];
  social?: Social[];
  paymentMethods?: PaymentMethods[];
  securitySeals?: SecuritySeals;
}

function Footer({
  logo,
  logoLinha,
  trademark,
  whatsAppLink = "https://api.whatsapp.com/send?phone=551130936121&text=Ol%C3%A1,%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es",
  email = "sac@ferragensforesta.com.br",
  phone = "(11) 3093-6121",
  businessHours = "Segunda a Sexta, das 8h às 17h",
  whatsappHours = "Segunda a Sexta 08h as 17h | Sábado 08h as 13h",
  institutionalLinks = [
    { title: "Sobre Nós", href: "/sobre" },
    { title: "Nossas Lojas", href: "/lojas" },
    { title: "Missão, Visão e Valores", href: "/missao-visao-valores" },
    { title: "Trabalhe Conosco", href: "/trabalhe-conosco" },
  ],
  policyLinks = [
    { title: "Política de Privacidade", href: "/politica-privacidade" },
    { title: "Política de Cookies", href: "/politica-cookies" },
    { title: "Política de Trocas e Devolução", href: "/politica-trocas" },
    { title: "Política de Entrega", href: "/politica-entrega" },
  ],
  social = [],
  paymentMethods = [],
  securitySeals = {
    title: "Loja Segura",
    seals: [],
    showTrustvox: false,
    trustvoxAlignment: "left",
  },
}: Props) {
  const device = useDevice();
  const isMobile = device === "mobile";

  return (
    <>
      <footer class="sm:px-0 mt-5 sm:mt-10" style={{ backgroundColor: "#fff" }}>
        {/* Script Trustvox para Selo Fixo - Apenas se showTrustvox estiver habilitado */}
        {securitySeals?.showTrustvox && (
          <script
            type="text/javascript"
            src="//certificate.trustvox.com.br/widget.js"
            async
          ></script>
        )}
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
          <div class="container flex flex-col w-full lg:pt-[72px] lg:pb-10">
            {/* Logo Section */}

            {/* Desktop Layout - 5 Columns */}
            {!isMobile ? (
              <div class="flex flex-col lg:grid lg:grid-cols-5 justify-between gap-3">
                {/* Coluna 1 - Contato */}
                <div class="flex flex-col gap-4">
                  <div>
                    <div class="w-full">
                      {logo && (
                        <Image
                          src={logo}
                          alt="Logo"
                          loading="lazy"
                          class="max-w-[200px]"
                          width={isMobile ? 200 : 300}
                        />
                      )}
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div>
                      <p class="text-white text-[14px] font-bold italic">
                        SAC:
                      </p>
                      <a
                        href={`mailto:${email}`}
                        class="text-white text-[14px] hover:underline"
                      >
                        {email}
                      </a>
                    </div>
                    <div>
                      <p class="text-white text-[14px] font-bold italic">
                        Horário de atendimento:
                      </p>
                      <p class="text-white text-[14px]">{businessHours}</p>
                    </div>
                    <div>
                      <p class="text-white text-[14px] font-bold italic">
                        Telefone:
                      </p>
                      <a
                        href={`tel:${phone}`}
                        class="text-white text-[14px] hover:underline"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp Section */}
                  <div class="flex items-center gap-3">
                    <svg
                      width="25"
                      height="26"
                      viewBox="0 0 25 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.3445 23.0764C10.548 23.0764 8.86666 22.5913 7.41983 21.744C7.28316 21.6677 7.15157 21.5863 7.0238 21.5011L3.07745 22.5526L4.12887 18.6069C3.13275 17.0742 2.55428 15.2485 2.55428 13.2861C2.55428 7.88852 6.94688 3.49592 12.3445 3.49592C17.7421 3.49592 22.1347 7.88852 22.1347 13.2861C22.1347 18.6838 17.7421 23.0764 12.3445 23.0764ZM11.9332 0.948081C5.58079 1.15468 0.334453 6.2993 0.0159738 12.6473C-0.0984501 14.9358 0.406286 17.099 1.38779 18.9775L0.00898018 25.1532C-0.0495031 25.4329 0.19778 25.6802 0.477483 25.6217L6.65319 24.2429H6.65764C8.52275 25.2174 10.6637 25.7221 12.9351 25.6166C19.2729 25.3235 24.434 20.116 24.6794 13.7763C24.9572 6.59553 19.1038 0.71542 11.9332 0.948081Z"
                        fill="#DAEFAE"
                      />
                      <path
                        d="M18.1504 17.5963C17.9794 17.8524 17.8001 18.0915 17.5147 18.3775C16.8873 19.0043 16.0164 19.3202 15.1328 19.2306C13.5499 19.0685 11.3009 18.1938 9.36709 16.2645C7.43397 14.3314 6.55926 12.0823 6.40097 10.4988C6.31134 9.6152 6.62728 8.74494 7.2547 8.11751C7.54076 7.83145 7.77978 7.65219 8.03596 7.47738C8.50955 7.15699 9.15414 7.37058 9.3334 7.90837L9.9818 9.85421C10.1611 10.3882 10.0797 10.7251 9.84958 10.9514L9.33276 11.472C9.07658 11.7282 9.03399 12.1255 9.23042 12.4326C9.51648 12.8807 10.0543 13.5978 11.044 14.5875C12.0344 15.5779 12.7515 16.1157 13.1997 16.4018C13.5067 16.5982 13.9034 16.555 14.1595 16.2995L14.6808 15.7826C14.9071 15.5519 15.244 15.4712 15.7774 15.6504L17.7238 16.2988C18.2616 16.4781 18.4746 17.1227 18.1504 17.5963Z"
                        fill="#DAEFAE"
                      />
                    </svg>

                    <div>
                      <a
                        href={whatsAppLink}
                        class="text-[#DAEFAE] italic text-[14px] hover:underline"
                      >
                        <strong>Compre pelo Whatsapp:</strong> {phone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <p class="text-white text-[14px] font-bold italic">
                      Horário de atendimento:
                    </p>
                    <p class="text-white text-[12px]">{whatsappHours}</p>
                  </div>
                </div>

                {/* Coluna 2 - Institucional */}
                <div class="flex flex-col gap-4">
                  <SectionTitle title="Institucional" />
                  <div class="flex flex-col gap-3">
                    {institutionalLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        class="text-white text-[14px] hover:underline"
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>

                  {/* Minha Conta */}
                  <div class="mt-4">
                    <div class="flex items-center gap-[10px] border-t border-white pt-4">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23.1575 12.5371C23.1575 6.66633 18.3983 1.90651 12.5276 1.90625C6.65665 1.90625 1.89673 6.66617 1.89673 12.5371C1.89699 18.4078 6.65681 23.167 12.5276 23.167C18.3981 23.1667 23.1572 18.4077 23.1575 12.5371ZM25.0637 12.5371C25.0635 19.4609 19.4514 25.073 12.5276 25.0732C5.60356 25.0732 -0.00926225 19.4611 -0.00952148 12.5371C-0.00952148 5.61293 5.6034 0 12.5276 0C19.4516 0.000259241 25.0637 5.61309 25.0637 12.5371Z"
                          fill="#DAEFAE"
                        />
                        <path
                          d="M15.7289 11.1262C15.7289 12.8946 14.2954 14.3281 12.5269 14.3281C10.7584 14.3281 9.32495 12.8946 9.32495 11.1262C9.32495 9.35768 10.7584 7.9242 12.5269 7.9242C14.2954 7.9242 15.7289 9.35768 15.7289 11.1262Z"
                          fill="#DAEFAE"
                        />
                        <path
                          d="M12.5268 24.1211C15.6944 24.1211 18.5626 22.8472 20.6534 20.7863C18.8436 18.248 15.8819 16.5869 12.5268 16.5869C9.17162 16.5869 6.20995 18.248 4.40015 20.7863C6.49092 22.8472 9.35915 24.1211 12.5268 24.1211Z"
                          fill="#DAEFAE"
                        />
                      </svg>

                      <a
                        href="/minha-conta"
                        class="text-[#DAEFAE] italic text-[14px] font-bold hover:underline"
                      >
                        Minha conta
                      </a>
                    </div>
                  </div>
                </div>

                {/* Coluna 3 - Políticas */}
                <div class="flex flex-col gap-4">
                  <SectionTitle title="Políticas" />
                  <div class="flex flex-col gap-3">
                    {policyLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        class="text-white text-[14px] hover:underline"
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Coluna 4 - Redes Sociais */}
                <div class="flex flex-col gap-4">
                  <SectionTitle title="Redes Sociais" />
                  <div class="flex flex-row flex-wrap gap-3">
                    {social.map(({ itens }) =>
                      itens.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          class="flex items-center justify-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.alt || "Rede Social"}
                            loading="lazy"
                            width={40}
                            height={40}
                            class="max-w-[40px] max-h-[40px]"
                          />
                        </a>
                      ))
                    )}
                  </div>
                </div>

                {/* Coluna 5 - Pagamentos e Segurança */}
                <div class="flex flex-col gap-6">
                  {/* Formas de Pagamento */}
                  <div>
                    <SectionTitle title="Formas de Pagamento" />
                    <div class="flex flex-wrap gap-2 mt-3">
                      {paymentMethods.map(({ payments }) =>
                        payments.map((payment, index) => (
                          <a key={index} href={payment.href} class="mb-2">
                            <Image
                              src={payment.image}
                              alt={payment.alt || "Forma de Pagamento"}
                              loading="lazy"
                              width={50}
                              height={30}
                            />
                          </a>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Loja Segura */}
                  {securitySeals && (
                    <div>
                      <SectionTitle title={securitySeals.title} />

                      {/* Selos de Segurança - Lista de Imagens */}
                      {securitySeals.seals &&
                        securitySeals.seals.length > 0 && (
                          <div class="flex flex-wrap gap-2 mt-3">
                            {securitySeals.seals.map((seal, index) => (
                              <a key={index} href={seal.href} class="mb-2">
                                <Image
                                  src={seal.image}
                                  alt={seal.alt || "Selo de Segurança"}
                                  loading="lazy"
                                />
                              </a>
                            ))}
                          </div>
                        )}

                      {/* TrustVox */}
                      <div
                        class={`mt-3 flex ${
                          securitySeals.trustvoxAlignment === "center"
                            ? "justify-center"
                            : securitySeals.trustvoxAlignment === "right"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {securitySeals.showTrustvox && (
                          <div
                            data-trustvox-certificate-fixed="data-trustvox-certificate-fixed"
                            class="trustvox-seal"
                            style="transform: scale(1.2); transform-origin: center; margin: 5px;"
                          ></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Mobile Layout - Todos os itens em Accordions */
              <div class="flex flex-col gap-4 pt-6">
                {/* Logo no Mobile */}
                <div class="w-full">
                  {logo && (
                    <Image
                      src={logo}
                      alt="Logo"
                      loading="lazy"
                      class="max-w-[200px]"
                      width={isMobile ? 200 : 300}
                    />
                  )}
                </div>

                {/* Dropdown Atendimento */}
                <AccordionItem title="Atendimento">
                  <div class="flex flex-col gap-3 mt-3">
                    <div>
                      <p class="text-white text-[14px] font-bold italic">
                        SAC:
                      </p>
                      <a
                        href={`mailto:${email}`}
                        class="text-white text-[14px] hover:underline"
                      >
                        {email}
                      </a>
                    </div>
                    <div>
                      <p class="text-white text-[14px] font-bold italic">
                        Horário de atendimento:
                      </p>
                      <p class="text-white text-[14px]">{businessHours}</p>
                    </div>
                    <div>
                      <p class="text-white text-[14px] font-bold italic">
                        Telefone:
                      </p>
                      <a
                        href={`tel:${phone}`}
                        class="text-white text-[14px] hover:underline"
                      >
                        {phone}
                      </a>
                    </div>

                    {/* WhatsApp Section Mobile */}
                    <div class="flex items-center gap-3 mt-4">
                      <svg
                        width="25"
                        height="26"
                        viewBox="0 0 25 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.3445 23.0764C10.548 23.0764 8.86666 22.5913 7.41983 21.744C7.28316 21.6677 7.15157 21.5863 7.0238 21.5011L3.07745 22.5526L4.12887 18.6069C3.13275 17.0742 2.55428 15.2485 2.55428 13.2861C2.55428 7.88852 6.94688 3.49592 12.3445 3.49592C17.7421 3.49592 22.1347 7.88852 22.1347 13.2861C22.1347 18.6838 17.7421 23.0764 12.3445 23.0764ZM11.9332 0.948081C5.58079 1.15468 0.334453 6.2993 0.0159738 12.6473C-0.0984501 14.9358 0.406286 17.099 1.38779 18.9775L0.00898018 25.1532C-0.0495031 25.4329 0.19778 25.6802 0.477483 25.6217L6.65319 24.2429H6.65764C8.52275 25.2174 10.6637 25.7221 12.9351 25.6166C19.2729 25.3235 24.434 20.116 24.6794 13.7763C24.9572 6.59553 19.1038 0.71542 11.9332 0.948081Z"
                          fill="#DAEFAE"
                        />
                        <path
                          d="M18.1504 17.5963C17.9794 17.8524 17.8001 18.0915 17.5147 18.3775C16.8873 19.0043 16.0164 19.3202 15.1328 19.2306C13.5499 19.0685 11.3009 18.1938 9.36709 16.2645C7.43397 14.3314 6.55926 12.0823 6.40097 10.4988C6.31134 9.6152 6.62728 8.74494 7.2547 8.11751C7.54076 7.83145 7.77978 7.65219 8.03596 7.47738C8.50955 7.15699 9.15414 7.37058 9.3334 7.90837L9.9818 9.85421C10.1611 10.3882 10.0797 10.7251 9.84958 10.9514L9.33276 11.472C9.07658 11.7282 9.03399 12.1255 9.23042 12.4326C9.51648 12.8807 10.0543 13.5978 11.044 14.5875C12.0344 15.5779 12.7515 16.1157 13.1997 16.4018C13.5067 16.5982 13.9034 16.555 14.1595 16.2995L14.6808 15.7826C14.9071 15.5519 15.244 15.4712 15.7774 15.6504L17.7238 16.2988C18.2616 16.4781 18.4746 17.1227 18.1504 17.5963Z"
                          fill="#DAEFAE"
                        />
                      </svg>

                      <div>
                        <a
                          href={whatsAppLink}
                          class="text-[#DAEFAE] italic text-[14px] hover:underline"
                        >
                          <strong>Compre pelo Whatsapp:</strong> {phone}
                        </a>
                      </div>
                    </div>
                    <div>
                      <p class="text-white text-[14px] font-bold italic">
                        Horário de atendimento:
                      </p>
                      <p class="text-white text-[12px]">{whatsappHours}</p>
                    </div>
                  </div>
                </AccordionItem>

                {/* Dropdown Institucional */}
                <AccordionItem title="Institucional">
                  <div class="flex flex-col gap-3 mt-3">
                    {institutionalLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        class="text-white text-[14px] hover:underline"
                      >
                        {link.title}
                      </a>
                    ))}

                    {/* Minha Conta Mobile */}
                    <div class="flex items-center gap-[10px] border-t border-white pt-4 mt-4">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23.1575 12.5371C23.1575 6.66633 18.3983 1.90651 12.5276 1.90625C6.65665 1.90625 1.89673 6.66617 1.89673 12.5371C1.89699 18.4078 6.65681 23.167 12.5276 23.167C18.3981 23.1667 23.1572 18.4077 23.1575 12.5371ZM25.0637 12.5371C25.0635 19.4609 19.4514 25.073 12.5276 25.0732C5.60356 25.0732 -0.00926225 19.4611 -0.00952148 12.5371C-0.00952148 5.61293 5.6034 0 12.5276 0C19.4516 0.000259241 25.0637 5.61309 25.0637 12.5371Z"
                          fill="#DAEFAE"
                        />
                        <path
                          d="M15.7289 11.1262C15.7289 12.8946 14.2954 14.3281 12.5269 14.3281C10.7584 14.3281 9.32495 12.8946 9.32495 11.1262C9.32495 9.35768 10.7584 7.9242 12.5269 7.9242C14.2954 7.9242 15.7289 9.35768 15.7289 11.1262Z"
                          fill="#DAEFAE"
                        />
                        <path
                          d="M12.5268 24.1211C15.6944 24.1211 18.5626 22.8472 20.6534 20.7863C18.8436 18.248 15.8819 16.5869 12.5268 16.5869C9.17162 16.5869 6.20995 18.248 4.40015 20.7863C6.49092 22.8472 9.35915 24.1211 12.5268 24.1211Z"
                          fill="#DAEFAE"
                        />
                      </svg>

                      <a
                        href="/minha-conta"
                        class="text-[#DAEFAE] italic text-[14px] font-bold hover:underline"
                      >
                        Minha conta
                      </a>
                    </div>
                  </div>
                </AccordionItem>

                {/* Dropdown Políticas */}
                <AccordionItem title="Políticas">
                  <div class="flex flex-col gap-3 mt-3">
                    {policyLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        class="text-white text-[14px] hover:underline"
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                </AccordionItem>

                {/* Dropdown Redes Sociais */}
                <AccordionItem title="Redes Sociais">
                  <div class="flex flex-row flex-wrap gap-3 mt-3">
                    {social.map(({ itens }) =>
                      itens.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          class="flex items-center justify-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.alt || "Rede Social"}
                            loading="lazy"
                            width={40}
                            height={40}
                            class="max-w-[40px] max-h-[40px]"
                          />
                        </a>
                      ))
                    )}
                  </div>
                </AccordionItem>

                {/* Dropdown Formas de Pagamento */}
                <AccordionItem title="Formas de Pagamento">
                  <div class="flex flex-wrap gap-2 mt-3">
                    {paymentMethods.map(({ payments }) =>
                      payments.map((payment, index) => (
                        <a key={index} href={payment.href} class="mb-2">
                          <Image
                            src={payment.image}
                            alt={payment.alt || "Forma de Pagamento"}
                            loading="lazy"
                            width={50}
                            height={30}
                          />
                        </a>
                      ))
                    )}
                  </div>
                </AccordionItem>

                {/* Dropdown Loja Segura */}
                {securitySeals && (
                  <AccordionItem title={securitySeals.title}>
                    {/* Selos de Segurança - Lista de Imagens */}
                    {securitySeals.seals && securitySeals.seals.length > 0 && (
                      <div class="flex flex-wrap gap-2 mt-3">
                        {securitySeals.seals.map((seal, index) => (
                          <a key={index} href={seal.href} class="mb-2">
                            <Image
                              src={seal.image}
                              alt={seal.alt || "Selo de Segurança"}
                              loading="lazy"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* TrustVox */}
                    <div
                      class={`mt-3 flex ${
                        securitySeals.trustvoxAlignment === "center"
                          ? "justify-center"
                          : securitySeals.trustvoxAlignment === "right"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {securitySeals.showTrustvox && (
                        <div
                          data-trustvox-certificate-fixed="data-trustvox-certificate-fixed"
                          class="trustvox-seal"
                          style="transform: scale(1.2); transform-origin: center; margin: 5px;"
                        ></div>
                      )}
                    </div>
                  </AccordionItem>
                )}
              </div>
            )}

            <div class="flex flex-col gap-6 items-center justify-between mt-[30px] lg:mt-16">
              <div class="flex flex-row items-start gap-4 mt-4 lg:mt-0">
                <div class="flex flex-col items-center justify-center gap-4">
                  <span class="text-[10px] font-normal text-white">
                    Powered by
                  </span>
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
                  <span class="text-[10px] font-normal text-white">
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
              <div class="pb-5 lg:pb-0flex flex-nowrap items-center justify-between sm:justify-center gap-4">
                <span class="text-xs font-normal text-center lg:text-start text-base-400 text-white">
                  {trademark}
                </span>
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

// Componente Auxiliar para Itens de Acordeão (usado apenas para mobile)
const AccordionItem = ({
  title,
  children,
  class: className = "",
}: {
  title: string;
  children: preact.ComponentChildren;
  class?: string;
}) => (
  <details class={`flex flex-col gap-[12px] ${className}`}>
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
