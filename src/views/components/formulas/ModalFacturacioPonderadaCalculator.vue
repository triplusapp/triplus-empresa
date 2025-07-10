<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="update" :strong="true" color="primary" shape="round" fill="solid">
          {{ $t('indicators.formulas.apply_btn') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">
    <h1 class="modal-title">{{ $t('indicators.formulas.facturacio_ponderada.title') }}</h1>
    <p>{{ $t('indicators.formulas.facturacio_ponderada.message') }}</p>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.facturacio_ponderada.total_anual')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="facturacio_total_anual"
          min="0" step="1"/>
    </div>
    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.facturacio_ponderada.num_jornades')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="num_workers"
          min="0" step="1"/>
    </div>
    <br>
    {{ $t('indicators.formulas.facturacio_ponderada.result') }}: {{ result }}
  </ion-content>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonButton, IonButtons, IonContent, IonFooter, IonInput, IonToolbar, modalController } from '@ionic/vue';

const props = defineProps<{ data_store?: { facturacio_total_anual?: number, num_workers?: number } }>();

const facturacio_total_anual = ref(props.data_store?.facturacio_total_anual || 0);
const num_workers = ref(props.data_store?.num_workers || 0);

const result = computed(() => {
  const totalAnual = Number(facturacio_total_anual.value);
  const workers = Number(num_workers.value);
  const facturacioPonderada = totalAnual / workers;
  return isNaN(facturacioPonderada) || !isFinite(facturacioPonderada) ? '-' : facturacioPonderada.toFixed(2);
});

const cancel = () => modalController.dismiss(null, 'cancel');
const update = () => modalController.dismiss({
  data_store: {
    facturacio_total_anual: Number(facturacio_total_anual.value),
    num_workers: Number(num_workers.value),
  },
  result: Number(result.value)
}, 'update');
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}
</style>
