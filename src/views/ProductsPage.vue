<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t('products.page_title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :router-link="Translation.i18nRoute({name: 'product'})"
                      size="default"
                      color="primary"
                      shape="round"
                      fill="solid">
            {{ $t('products.add_product_btn') }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">

      <div class="intro-evaluation-page" v-html="$t('products.intro')"></div>

      <div class="select-brand-wrapper">
        <ion-icon :icon="filterOutline" size="large"></ion-icon>
        <ion-select
            style="max-width: 300px;"
            :label="$t('products.manage.brand_name_label')"
            v-model="selectedBrandId"
            @ionChange="onBrandChange"
            class="input-custom"
            fill="solid"
            label-placement="floating"
            placeholder="Selecciona una marca">
          <ion-select-option v-for="brand in brands" :value="brand.id">
            {{ brand.name }}
          </ion-select-option>
        </ion-select>
      </div>

      <ion-list :inset="true" v-if="products.length>0">

        <ion-item v-for="product in products" v-if="allSectors.length>0">

          <div style="display: flex;width: 100%;align-items:center;padding: 4px 0;">

            <div style="flex: 1;">
              <h6 style="margin: 0;">{{ product.name }}</h6>
              <div><small>Sector: {{ getSectorName(product.sector_id) }}</small></div>
              <div><small>Marca: {{ getBrandName(product.brand_id) }}</small></div>
            </div>

            <div style="display: flex; gap: 20px;align-items:center;">
              <div style="display: flex;align-items: center;">
                <div style="width: 50px;height: 50px;">
                  <img :src="productInformationById[product.id]?.stamp_url" width="50"
                       v-show="productInformationById[product.id]?.stamp_url">
                </div>
                <ion-button :href="productsStampSvgById[product.id]"
                            :download="product.name +' '+product.brand_name+'.svg'"
                            v-show="productsStampSvgById[product.id]" color="medium" shape="round"
                            fill="clear" size="small"
                            :title="$t('products.download_stamp')"
                >
                  <ion-icon slot="start" :icon="download"></ion-icon>
                </ion-button>
              </div>

              <div style="text-align: center;">
                <div>
                  {{ productInformationById[product.id]?.num_structural_indicators_evaluated ?? '-' }} /
                  {{ productInformationById[product.id]?.num_structural_indicators ?? '-' }}
                </div>
                <small>{{ $t('products.estructurals') }}</small>
              </div>
              <div style="text-align: center;">
                <div>
                  {{ productInformationById[product.id]?.num_complementary_indicators_evaluated ?? '-' }} /
                  {{ productInformationById[product.id]?.num_complementary_indicators ?? '-' }}
                </div>
                <small>{{ $t('products.complementaris') }}</small>
              </div>

              <ion-button type="button" :router-link="Translation.i18nRoute({
                name: 'product-evaluation',
                params: {
                    productId: product.id,
                }
            })" size="small" color="light" shape="round">
                {{ $t('products.evaluate_btn') }}
              </ion-button>

              <ion-button :router-link="Translation.i18nRoute({
                name: 'product',
                params: {
                    productId: product.id,
                }
            })" size="small" color="primary" fill="clear">
                <ion-icon :icon="createOutline"></ion-icon>
              </ion-button>
              <ion-button type="button" size="small" fill="clear" color="danger"
                          @click="askDeleteConfirmation(product)">
                <ion-icon :icon="trashBin"></ion-icon>
              </ion-button>
            </div>
          </div>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </main-layout>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {createOutline, download, filterOutline, trashBin} from "ionicons/icons";
import {
  alertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import MainLayout from "@/layouts/MainLayout.vue";
import Translation from "@/i18n/translation.js";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const allSectors = ref([]);
const products = ref([]);
const currentPageNumber = ref(0);
const brands = ref([]);
const selectedBrandId = ref('');
const productInformationById = ref({});
const productsStampSvgById = ref({});

const getSectorName = (sectorId) => allSectors.value.find(sector => sector.id === sectorId).name;
const getBrandName = function (brandId) {
  const brand = brands.value.find(brand => brand.id === brandId);
  return (brand) ? brand.name : '';
};

const fetchEvaluationsInformation = (productsIds) => {
  // Fill evaluated indicators number
  TraceabilityApiMethods.fetchProductsIndicatorsInformation(productsIds)
      .then(productsInfo => {
        productsInfo.forEach((productInfo) => {
          productInformationById.value[productInfo.product_id] = {
            stamp_url: productInfo.stamp_url,
            num_structural_indicators: productInfo.num_structural_indicators,
            num_structural_indicators_evaluated: productInfo.num_structural_indicators_evaluated,
            num_complementary_indicators: productInfo.num_complementary_indicators,
            num_complementary_indicators_evaluated: productInfo.num_complementary_indicators_evaluated
          }

          prepareSvgForDownloadConvertingSvgToBase64(productInfo.product_id, productInfo.stamp_url);
        });
      });
}

const onBrandChange = async (event) => {
  selectedBrandId.value = event.detail.value;
  currentPageNumber.value = 0;
  products.value = [];
  productInformationById.value = {};
  fetchProducts();
}

const fetchBrands = async () => {
  const loadingPage = await SharedMethods.showLoadingPage();
  TraceabilityApiMethods.fetchCompany()
      .then((data) => brands.value = data.brands)
      .finally(() => loadingPage.dismiss());
};


const fetchProducts = async () => {
  currentPageNumber.value += 1;
  TraceabilityApiMethods.fetchProducts(currentPageNumber.value, 15, selectedBrandId.value)
      .then(response => {
        Array.prototype.push.apply(products.value, response);
        const productsIdsToFetchInfo = response.map((product) => product.id);
        if (productsIdsToFetchInfo.length > 0) {
          fetchEvaluationsInformation(productsIdsToFetchInfo);
        }
      });
}

const fetchAllSectors = async () => TraceabilityApiMethods.fetchAllSectors().then(data => allSectors.value = data)

const deleteProduct = (productId) => {
  TraceabilityApiMethods
      .deleteProduct(productId)
      .then(() => SharedMethods.showSuccessfulToast(t('products.alert_messages.product_deleted')))
      .then(() => products.value = products.value.filter((product) => product.id !== productId))
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });
}

const askDeleteConfirmation = async (product) => {
  const alertButtons = [
    {
      text: t('products.delete_confirmation.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('products.delete_confirmation.confirm_btn'),
      role: 'confirm',
      handler: () => deleteProduct(product.id),
    },
  ];
  const alert = await alertController.create({
    header: t('products.delete_confirmation.header'),
    message: t('products.delete_confirmation.message', {product: product.name}),
    buttons: alertButtons,
  });
  await alert.present();
}

const prepareSvgForDownloadConvertingSvgToBase64 = async (productId, stampUrl) => {
  fetch(stampUrl)
      .then(response => response.text())
      .then(svgContent => productsStampSvgById.value[productId] = 'data:image/svg+xml;base64,' + btoa(svgContent))
      .catch(error => console.error('Error carregant l\'SVG:', error));
}

const ionInfinite = (ev) => {
  fetchProducts();
  ev.target.complete()
};

onMounted(() => {
  fetchBrands();
  fetchAllSectors();
  fetchProducts();
});

</script>
<style scoped>
ion-list {
  background: #fff;
}

ion-item {
  --ion-background-color: #fff;
  --ion-item-background: #fff;
}

.select-brand-wrapper {
  display: flex;
  justify-content: right;
  margin-right: 16px;
  align-items: center;
  gap: 1rem;
}
</style>
