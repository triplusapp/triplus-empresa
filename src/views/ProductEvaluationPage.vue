<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          {{ $t('products.evaluation.page_title', {product: product?.name}) }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button
              shape="round"
              :router-link="Translation.i18nRoute({
                name: 'product',
                params: {
                    productId: productId,
                }
            })" color="primary" size="small"
              fill="outline">
            {{ $t('products.evaluation.edit_btn') }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">

        <div style="text-align: right;" v-if="scores.length>0">
          <ion-button color="medium" @click="downloadEvaluationPdf" shape="round" fill="outline" size="small" :disabled="downloadingEvaluation">
            <span v-show="downloadingEvaluation">
              <ion-spinner color="medium" name="dots"></ion-spinner>
            </span>
            <span v-show="!downloadingEvaluation">
              <ion-icon slot="start" :icon="download"></ion-icon>
              {{ $t('products.evaluation.download_indicators_pdf') }}
            </span>
          </ion-button>
        </div>

        <div v-if="scores.length>0" class="scores-wrapper">
          <div>
            <img :src="stampUrl" width="112">


            <div>
              <ion-button :href="stampSvgBase64" :download="stampDownloadFilename"
                          v-if="stampSvgBase64" color="medium" shape="round"
                          fill="clear" size="small"
                          style="--padding-start: 0.5em;"
              >
                <ion-icon slot="start" :icon="download"></ion-icon>
                {{ $t('products.evaluation.download_stamp') }}
              </ion-button>
            </div>


          </div>
          <div class="scores">
            <div v-for="categoryScore in scores" class="score">
              <div class="number">
                {{ categoryScore.score ?? '-' }}
              </div>
              <div class="title">
                {{ categoryScore.name }}
              </div>
            </div>
          </div>

          <div class="descriptive-icons">
            <div class="item" v-if="adnColor">
              <adn-icon width="60" height="60" :color="adnColor"></adn-icon>
              <div class="title">{{ $t('products.evaluation.descriptive_icons.adn_title') }}</div>
            </div>

            <div class="item" v-if="modelRamader && modelRamader.icon">
              <chicken-icon v-if="modelRamader.icon==='chicken'" width="60" height="60" :color="modelRamader.color"></chicken-icon>
              <cow-icon v-if="modelRamader.icon==='cow'" width="60" height="60" :color="modelRamader.color"></cow-icon>
              <goat-icon v-if="modelRamader.icon==='goat'" width="60" height="60" :color="modelRamader.color"></goat-icon>
              <horse-icon v-if="modelRamader.icon==='horse'" width="60" height="60" :color="modelRamader.color"></horse-icon>
              <pig-icon v-if="modelRamader.icon==='pig'" width="60" height="60" :color="modelRamader.color"></pig-icon>
              <rabbit-icon v-if="modelRamader.icon==='rabbit'" width="60" height="60" :color="modelRamader.color"></rabbit-icon>
              <sheep-icon v-if="modelRamader.icon==='sheep'" width="60" height="60" :color="modelRamader.color"></sheep-icon>
              <div class="title">{{ $t('products.evaluation.descriptive_icons.model_ramader') }}</div>
            </div>
          </div>
        </div>

        <small v-if="scores.length>0 && scores.filter((category) => !category.score).length > 0 "
               style="text-align: right;display: block;margin-bottom: 1rem;">
          {{ $t('products.evaluation.score_info') }}
        </small>

        <indicators-list
            v-if="indicators.length>0"
            :indicators="indicators"
            :evaluable-model-id="product.id"
            evaluable-model-type="product"
        />

        <div style="display: flex;justify-content: right;margin-top: 20px;">
          <ion-button type="button" size="small" fill="clear" color="danger"
                      @click="askDeleteConfirmation">
            <ion-icon slot="start" :icon="trashBin"></ion-icon>
            {{ $t('products.manage.delete_btn') }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  </main-layout>
</template>

<script setup>
import Translation from "@/i18n/translation.js";
import {
  alertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonSpinner,
  IonTitle,
  IonToolbar
} from "@ionic/vue";

import {onBeforeMount, ref} from 'vue';
import IndicatorsList from "@/views/components/IndicatorsList.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {useRoute, useRouter} from "vue-router";
import SharedMethods from "@/shared/SharedMethods.js";
import {download, trashBin} from "ionicons/icons";
import MainLayout from "@/layouts/MainLayout.vue";
import {useI18n} from "vue-i18n";
import AdnIcon from "@/views/components/icons/adn-icon.vue";
import PigIcon from "@/views/components/icons/pig-icon.vue";
import ChickenIcon from "@/views/components/icons/chicken-icon.vue";
import CowIcon from "@/views/components/icons/cow-icon.vue";
import GoatIcon from "@/views/components/icons/goat-icon.vue";
import HorseIcon from "@/views/components/icons/horse-icon.vue";
import RabbitIcon from "@/views/components/icons/rabbit-icon.vue";
import SheepIcon from "@/views/components/icons/sheep-icon.vue";

const {t} = useI18n();

const route = useRoute();
const router = useRouter();
const productId = route.params.productId;
const product = ref(null);

const indicators = ref([]);
const scores = ref([]);
const adnColor = ref(null);
const modelRamader = ref({
  color: null,
  icon: null,
});
const stampUrl = ref(null);
const stampSvgBase64 = ref(null);
const stampDownloadFilename = ref(null);
const downloadingEvaluation = ref(false);

const askDeleteConfirmation = async () => {
  const alertButtons = [
    {
      text: t('products.delete_confirmation.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('products.delete_confirmation.confirm_btn'),
      role: 'confirm',
      handler: () => deleteProducte(),
    },
  ];

  const alert = await alertController.create({
    header: t('products.delete_confirmation.header'),
    message: t('products.delete_confirmation.message_current_product', {product: product.name}),
    buttons: alertButtons,
  });
  await alert.present();
}

const deleteProducte = async () => {
  TraceabilityApiMethods
      .deleteProduct(productId)
      .then(() => SharedMethods.showSuccessfulToast(t('products.alert_messages.product_deleted')))
      .then(() => {
        setTimeout(() => {
          const route = Translation.i18nRoute({name: 'products'});
          router.push(route);
        }, 2000);
      })
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });
}

const fetchProductIndicators = async () => {
  const loadingPage = await SharedMethods.showLoadingPage();
  TraceabilityApiMethods.fetchProductIndicators(productId)
      .then(data => indicators.value = data)
      .finally(() => loadingPage.dismiss());
}

const fetchCategoriesScores = async () => TraceabilityApiMethods
    .fetchScores(productId)
    .then(function (data) {
      scores.value = data.scores;
      adnColor.value = data.adn_color;
      modelRamader.value = data.model_ramader;
    })
const fetchStampTriplus = async () => {
  TraceabilityApiMethods.fetchProductsIndicatorsInformation([productId])
      .then(productsInfo => stampUrl.value = productsInfo[0].stamp_url)
      .then(() => convertSvgToBase64());
}
const downloadEvaluationPdf = async () => {
  if (downloadingEvaluation.value) {
    return;
  }
  downloadingEvaluation.value = true;
  TraceabilityApiMethods.downloadEvaluationPdf(productId)
      .then((blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', productId + '.pdf');
        document.body.appendChild(link);
        link.click();
      })
      .catch(message => SharedMethods.showErrorToast('Error file downloading'))
      .finally(() => downloadingEvaluation.value = false);
}

const convertSvgToBase64 = async () => {
  fetch(stampUrl.value)
      .then(response => response.text())
      .then(svgContent => {
        stampSvgBase64.value = 'data:image/svg+xml;base64,' + btoa(svgContent);
      })
      .catch(error => {
        console.error('Error carregant l\'SVG:', error);
      });
}

const fetchProduct = async () => {
  TraceabilityApiMethods.fetchProduct(productId)
      .then(data => product.value = data)
      .then(() => stampDownloadFilename.value = `${product.value.brand_name} ${product.value.name}.svg`);
}


onBeforeMount(() => {
  fetchProduct();
  fetchProductIndicators();
  fetchCategoriesScores();
  fetchStampTriplus();
});

</script>

<style scoped>
.scores-wrapper {
  display: flex;
  gap: 32px;
  margin: var(--ion-padding) 0;
}

.scores,
.descriptive-icons {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: var(--ion-padding) 0
}


.score,
.descriptive-icons .item {
  padding: var(--ion-padding);
  text-align: center;
  flex: 1;
}

.score:not(:last-child),
.descriptive-icons .item:not(:last-child) {
  border-right: 1px solid #d8d8d8;
}

.score .number {
  text-align: center;
  font-size: 1.5rem;
  line-height: 1.6rem;
  font-weight: bold;
}

.score .title {
  text-align: center;
  font-size: 0.8rem;
  line-height: 0.9rem;
  white-space: nowrap;
  margin-top: 8px;
}

.descriptive-icons .item {
  padding-top: 0;
  padding-bottom: 0;
}

.descriptive-icons .item .title {
  text-align: center;
  font-size: 0.8rem;
  line-height: 0.9rem;
}

</style>
