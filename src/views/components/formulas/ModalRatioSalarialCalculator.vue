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
    <h1 class="modal-title">{{ $t('indicators.formulas.ratio_salarial.title') }}</h1>
    <p>{{ $t('indicators.formulas.ratio_salarial.message') }}</p>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.ratio_salarial.sou_brut_mes_alt')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="sou_mes_alt"
          min="0" step="1"/>
    </div>
    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.ratio_salarial.sou_brut_mes_baix')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="sou_mes_baix"
          min="0" step="1"/>
    </div>
    <br>
    {{ $t('indicators.formulas.ratio_salarial.result') }}: {{ result }}
  </ion-content>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonButton, IonButtons, IonContent, IonFooter, IonInput, IonToolbar, modalController } from '@ionic/vue';

const props = defineProps<{ data_store?: { sou_mes_alt?: number, sou_mes_baix?: number } }>();

const sou_mes_alt = ref(props.data_store?.sou_mes_alt || 0);
const sou_mes_baix = ref(props.data_store?.sou_mes_baix || 0);

const result = computed(() => {
  const souAlt = Number(sou_mes_alt.value);
  const souBaix = Number(sou_mes_baix.value);
  const ratioSalarial = souAlt / souBaix;
  return isNaN(ratioSalarial) || !isFinite(ratioSalarial) ? '-' : ratioSalarial.toFixed(2);
});

const cancel = () => modalController.dismiss(null, 'cancel');
const update = () => modalController.dismiss({
  data_store: {
    sou_mes_alt: Number(sou_mes_alt.value),
    sou_mes_baix: Number(sou_mes_baix.value),
  },
  result: Number(result.value)
}, 'update');
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}
</style>
