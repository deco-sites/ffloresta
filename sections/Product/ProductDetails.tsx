import { ProductDetailsPage } from "apps/commerce/types.ts";
import ProductImagesGallery from "../../islands/ProductImagesGallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import { clx } from "../../sdk/clx.ts";
import ProductDescriptionIsland from "../../islands/ProductDescriptionIsland.tsx";
import ProductPagePromoBannerIsland from "../../islands/ProductPagePromoBannerIsland.tsx";
import type { ImageWidget as Image } from "apps/admin/widgets.ts";
import { HTMLWidget as HTML } from "apps/admin/widgets.ts";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import ProductBenefits from "../../components/product/ProductBenefits.tsx";
import Section from "../../components/ui/Section.tsx";

interface Benefit {
  benefitImgSrc: Image;
  benefitImgAltText: string;
  benefitText: HTML;
  benefitLink?: string;
}

interface ProductBanner {
  image: Image;
  /** @description Data de termino da Promoção em ISO completo: YYYY-MM-DDTHH:mm:ss.sssZ  */
  countdownDate: string;
  title: string;
  promoName: string;
  /** @title Configurações de Exibição */
  displaySettings?: {
    /** @title IDs das Coleções (separados por vírgula) */
    collectionIds?: string;
    /** @title Exibir para Todos os Produtos */
    showForAllProducts?: boolean;
  };
}

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  /** @title Banners Promocionais */
  productBanners?: ProductBanner[];
  benefits?: Benefit[];
  /** @title Store ID da Trustvox */
  storeId?: string;
}

function checkProductInCollections(
  page: ProductDetailsPage,
  collectionIds: string,
): boolean {
  if (!page?.product) return false;

  const productCollections = page.product.isRelatedTo || [];
  const targetCollectionIds = collectionIds.split(",").map((id) => id.trim());

  return productCollections.some(
    (collection) =>
      collection.productGroupID &&
      targetCollectionIds.includes(collection.productGroupID),
  );
}

function getBannersToDisplay(
  page: ProductDetailsPage,
  productBanners?: ProductBanner[],
): ProductBanner[] {
  if (!productBanners || productBanners.length === 0) return [];

  return productBanners.filter((banner) => {
    const { displaySettings } = banner;

    // Se não há configurações de exibição, mostra o banner (comportamento original)
    if (!displaySettings) return true;

    // Se está marcado para exibir para todos os produtos
    if (displaySettings.showForAllProducts) return true;

    // Se há IDs de coleção e o produto está em alguma delas
    if (displaySettings.collectionIds) {
      return checkProductInCollections(page, displaySettings.collectionIds);
    }

    // Caso padrão: mostra o banner
    return true;
  });
}

export default function ProductDetails({
  page,
  productBanners,
  benefits,
  storeId = "125156",
}: Props) {
  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Página não encontrada!</span>
          <a href="/" class="btn no-animation">
            Voltar ao Início
          </a>
        </div>
      </div>
    );
  }

  // Obtém os banners que devem ser exibidos para este produto
  const bannersToDisplay = getBannersToDisplay(page, productBanners);

  const breadcrumbItems = [...page.breadcrumbList.itemListElement];
  breadcrumbItems.pop();

  return (
    <div class="w-full flex flex-col bg-white">
      {/* Banners para mobile */}
      <div class="block lg:hidden mt-6">
        {bannersToDisplay.map((banner, index) => (
          <ProductPagePromoBannerIsland key={index} {...banner} />
        ))}
      </div>

      {page.breadcrumbList.itemListElement && (
        <div class="container mt-6 lg:mt-20">
          <Breadcrumb itemListElement={breadcrumbItems} />
        </div>
      )}

      <div
        class={clx(
          "container grid md:mt-8",
          "grid-cols-1 gap-9 py-0",
          "lg:grid-cols-[1fr_380px] lg:gap-11",
        )}
      >
        <div class="w-full flex flex-col">
          <ProductImagesGallery page={page} />
        </div>
        <div class="h-fit px-5 pb-4 pt-6 shadow-[2px_4px_12px_rgba(0,0,0,0.145)] mb-10 lg:mb-0 bg-[#fdfff5]">
          {/* Banners para desktop */}
          {bannersToDisplay.length > 0 && (
            <div class="hidden lg:block mb-5">
              {bannersToDisplay.map((banner, index) => (
                <div class={index > 0 ? "mt-4" : ""}>
                  <ProductPagePromoBannerIsland key={index} {...banner} />
                </div>
              ))}
            </div>
          )}

          <ProductInfo page={page} storeId={storeId} />
        </div>
      </div>
      <div class="container">
        {benefits && <ProductBenefits benefits={benefits} />}
      </div>

      <ProductDescriptionIsland page={page} />
    </div>
  );
}

export const LoadingFallback = () => (
  <Section.Container>
    <Section.Placeholder height="555px" />;
  </Section.Container>
);
