<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="update" :strong="true" color="primary" shape="round" fill="solid">{{ $t('indicators.formulas.apply_btn') }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">
    <h1 class="modal-title">{{ $t('indicators.formulas.despesa_energetica.title') }}</h1>
    <p>{{ $t('indicators.formulas.despesa_energetica.message') }}</p>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.despesa_energetica.despesa_final_label')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="despesa_consum_final"
          min="0" step="1"/>
    </div>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.despesa_energetica.despesa_total_label')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="despesa_total_consum_empresa"
          min="0" step="1"/>
    </div>

    <br>
    {{ $t('indicators.formulas.despesa_energetica.result') }}: {{ result }}
  </ion-content>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonButton, IonButtons, IonContent, IonFooter, IonInput, IonToolbar, modalController } from '@ionic/vue';

const props = defineProps<{ data_store?: { despesa_consum_final?: number, despesa_total_consum_empresa?: number } }>();

const despesa_consum_final = ref(props.data_store?.despesa_consum_final || 0);
const despesa_total_consum_empresa = ref(props.data_store?.despesa_total_consum_empresa || 0);

const result = computed(() => {
  const despesaFinal = Number(despesa_consum_final.value);
  const despesaTotal = Number(despesa_total_consum_empresa.value);
  const despesaEnergia = (despesaFinal / despesaTotal) * 100;
  return isNaN(despesaEnergia) || !isFinite(despesaEnergia) ? '-' : despesaEnergia.toFixed(2);
});

const cancel = () => modalController.dismiss(null, 'cancel');
const update = () => modalController.dismiss({
  data_store: {
    despesa_consum_final: Number(despesa_consum_final.value),
    despesa_total_consum_empresa: Number(despesa_total_consum_empresa.value),
  },
  result: Number(result.value)
}, 'update');
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}
</style>
