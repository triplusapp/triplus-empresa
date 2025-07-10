<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">
          <span v-show="status==='checked_invalid'">{{ $t('global.close_btn') }}</span>
          <span v-show="status!=='checked_invalid'">{{ $t('global.cancel_btn') }}</span>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="checkIndicators" :strong="true" color="primary" fill="solid" shape="round"
                    v-show="status==='check_pending'">
          {{ $t('evaluation_status_bar.confirm_btn')}}
        </ion-button>
        <div v-show="status==='checking'" class="checking-status-info">
          <ion-spinner name="circular" color="medium"></ion-spinner>
        </div>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">
    <h1 v-show="status==='check_pending'" class="modal-title">
      {{ $t('evaluation_status_bar.confirmation_title')}}
    </h1>
    <div v-html="$t('evaluation_status_bar.confirmation_message')" v-show="status==='check_pending'" class="validation-instructions-message"></div>
    <div v-show="status==='checking'">
      <p>{{ $t('evaluation_status_bar.checking_all_filled.info') }}</p>
      <p><small>{{ $t('evaluation_status_bar.checking_all_filled.wait') }}</small></p>
    </div>
    <div v-show="status==='checked_invalid'" class="alert-danger">
      <p>{{ $t('evaluation_status_bar.checked_invalid', {count: numPendingIndicators}) }}</p>
      <div v-if="pendingCompanyIndicators.length">
        <strong>Empresa:</strong>
        <ul>
          <li>{{ $t('evaluation_status_bar.company_structural_indicators_pending', { count: pendingCompanyIndicators.length }) }}</li>
        </ul>
      </div>
      <div v-if="pendingSectorsIndicators && Object.keys(pendingSectorsIndicators).length">
        <strong>{{ $t('evaluation_status_bar.sectors_title') }}:</strong>
        <ul>
          <li v-for="[key, sectorIndicators] in Object.entries(pendingSectorsIndicators)" :key="key">
            {{ $t('evaluation_status_bar.sector_structural_indicators_pending', { count: sectorIndicators.length, sectorName: sectorIndicators[0].evaluable_name }) }}
          </li>
        </ul>
      </div>
      <div v-if="pendingProductsIndicators && Object.keys(pendingProductsIndicators).length">
        <strong>{{ $t('evaluation_status_bar.products_title') }}:</strong>
        <ul>
          <li v-for="[key, productIndicators] in Object.entries(pendingProductsIndicators)" :key="key">
            {{ $t('evaluation_status_bar.product_structural_indicators_pending', { count: productIndicators.length, productName: productIndicators[0].evaluable_name }) }}
          </li>
        </ul>
      </div>

    </div>
  </ion-content>
</template>

<script setup>
import {
  IonFooter,
  IonButton,
  IonButtons,
  IonContent,
  IonSpinner,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import {ref} from 'vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";

const status = ref('check_pending');
const numPendingIndicators = ref(null);
const pendingCompanyIndicators = ref([]);
const pendingSectorsIndicators = ref();
const pendingProductsIndicators = ref();

const cancel = () => {
  modalController.dismiss(null, 'cancel');
};

const checkIndicators = async () => {
  status.value = 'checking';

  // Establir el temps mínim de 5 segons
  const minTime = 5000;
  const startTime = Date.now();

  const response = await TraceabilityApiMethods.checkEvaluationsCanBeFinished();

  // Espera fins a arribar als 10 segons mínims, independentment de quan arribi la resposta
  const elapsedTime = Date.now() - startTime;
  const remainingTime = minTime - elapsedTime;

  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }

  if (response.can_be_finished) {
    status.value = 'checked_valid';
    return modalController.dismiss({}, 'confirm');
  }
  numPendingIndicators.value = response.pending_indicators_count;
  pendingCompanyIndicators.value = response.pending_company_indicators;
  pendingSectorsIndicators.value = response.pending_sectors_indicators.reduce((acc, indicator) => {
    if (!acc[indicator.evaluable_id]) {
      acc[indicator.evaluable_id] = [];
    }
    acc[indicator.evaluable_id].push(indicator);
    return acc;
  }, {})

  pendingProductsIndicators.value = response.pending_products_indicators.reduce((acc, indicator) => {
    if (!acc[indicator.evaluable_id]) {
      acc[indicator.evaluable_id] = [];
    }
    acc[indicator.evaluable_id].push(indicator);
    return acc;
  }, {})
  status.value = 'checked_invalid';
};
</script>

<style scoped>
ion-spinner {
  margin-right: 1rem;
  width: 20px;
}

ul {
  margin-top: 0;
}
</style>
<style>
.validation-instructions-message li{
  margin: 12px 0;
}
</style>
