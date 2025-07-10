<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="update" :strong="true" color="primary" shape="round" fill="solid">
          {{ $t('indicators.formulas.apply_btn') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">
    <h1 class="modal-title">{{ $t('indicators.formulas.bretxa_genere.title') }}</h1>
    <p>{{ $t('indicators.formulas.bretxa_genere.message') }}</p>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.bretxa_genere.sou_brut_mitja_homes')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="sou_brut_mitja_homes"
          min="0" step="1"/>
    </div>
    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.bretxa_genere.sou_brut_mitja_dones')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="sou_brut_mitja_dones"
          min="0" step="1"/>
    </div>
    <br>
    {{ $t('indicators.formulas.bretxa_genere.result') }}: {{ result }}
  </ion-content>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {IonButton, IonButtons, IonContent, IonFooter, IonInput, IonToolbar, modalController} from '@ionic/vue';

const props = defineProps<{ data_store?: { sou_brut_mitja_homes?: number, sou_brut_mitja_dones?: number } }>();

const sou_brut_mitja_homes = ref(props.data_store?.sou_brut_mitja_homes || 0);
const sou_brut_mitja_dones = ref(props.data_store?.sou_brut_mitja_dones || 0);

const result = computed(() => {
  const homes = Number(sou_brut_mitja_homes.value);
  const dones = Number(sou_brut_mitja_dones.value);
  const bretxaSalarial = ((homes - dones) / homes) * 100;
  return isNaN(bretxaSalarial) || !isFinite(bretxaSalarial) ? '-' : bretxaSalarial.toFixed(2);
});

const cancel = () => modalController.dismiss(null, 'cancel');
const update = () => modalController.dismiss({
  data_store: {
    sou_brut_mitja_homes: Number(sou_brut_mitja_homes.value),
    sou_brut_mitja_dones: Number(sou_brut_mitja_dones.value),
  },
  result: Number(result.value)
}, 'update');
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}
</style>
