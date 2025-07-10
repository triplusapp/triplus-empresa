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

    <h1 class="modal-title">{{ $t('indicators.formulas.desviacio_paritat_llocs_responsabilitat.title') }}</h1>
    <p>{{ $t('indicators.formulas.desviacio_paritat_llocs_responsabilitat.message') }}</p>

    <ion-label class="ion-text-wrap">
      {{ $t('indicators.formulas.desviacio_paritat_llocs_responsabilitat.percentatge_info') }}
    </ion-label>
    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          onwheel="return false;"
          :label="$t('indicators.formulas.desviacio_paritat_llocs_responsabilitat.percentatge_label')"
          placeholder="0"
          type="number"
          v-model="percentatge_conjunt_entitat"
          max="100"
          min="0"
          step="0.01"/>
    </div>
    <ion-label class="ion-text-wrap">
      {{ $t('indicators.formulas.desviacio_paritat_llocs_responsabilitat.percentatge_responsabilitat_info') }}
    </ion-label>
    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          onwheel="return false;"
          placeholder="0"
          :label="$t('indicators.formulas.desviacio_paritat_llocs_responsabilitat.percentatge_label')"
          type="number"
          v-model="percentatge_responsabilitat"
          max="100"
          min="0"
          step="0.01"/>
    </div>
    <br>
    {{ $t('indicators.formulas.desviacio_paritat_llocs_responsabilitat.result') }}: {{ result }}

  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    data_store: {
      type: Object
    }
  },
  data() {
    return {
      percentatge_conjunt_entitat: this.data_store?.percentatge_conjunt_entitat,
      percentatge_responsabilitat: this.data_store?.percentatge_responsabilitat,
    }
  },
  components: {
    IonLabel,
    IonContent, IonFooter, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonCheckbox
  },
  methods: {
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    update() {
      return modalController.dismiss({
        data_store: {
          percentatge_conjunt_entitat: Number(this.percentatge_conjunt_entitat),
          percentatge_responsabilitat: Number(this.percentatge_responsabilitat),
        },
        result: Number(this.result)
      }, 'update');
    },
  },
  computed: {
    result() {
      let desviacio = Number(this.percentatge_conjunt_entitat) - Number(this.percentatge_responsabilitat);
      if (isNaN(desviacio) || !isFinite(desviacio)) {
        return '-';
      }
      return desviacio.toFixed(2);
    }
  }
});
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}
</style>
