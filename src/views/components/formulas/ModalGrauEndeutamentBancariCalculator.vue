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

    <h1 class="modal-title">{{ $t('indicators.formulas.grau_endeutament_bancari.title') }}</h1>
    <p>{{ $t('indicators.formulas.grau_endeutament_bancari.message') }}</p>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.grau_endeutament_bancari.deute_total')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="deute_total"
          min="0" step="1"/>
    </div>
    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.grau_endeutament_bancari.facturacio_total')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="facturacio_anual"
          min="0" step="1"/>
    </div>
    <br>
    {{ $t('indicators.formulas.grau_endeutament_bancari.result') }}: {{ result }}

  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonFooter,
  IonTitle,
  IonToolbar,
  IonCheckbox,
  IonButtons,
  IonButton,
  IonItem,
  IonInput,
  modalController,
} from '@ionic/vue';
import {defineComponent} from 'vue';
import {useI18n} from "vue-i18n";
import SharedMethods from "@/shared/SharedMethods.js";

export default defineComponent({
  setup() {
    const {t} = useI18n();
    return {t};
  },
  props: {
    data_store: {
      type: Object
    }
  },
  data() {
    return {
      deute_total: this.data_store?.deute_total,
      facturacio_anual: this.data_store?.facturacio_anual,
    }
  },
  components: {IonContent, IonFooter, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonCheckbox},
  methods: {
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    update() {
      if (
          isNaN(this.facturacio_anual) || isNaN(this.deute_total)
          || this.facturacio_anual == 0
      ) {
        SharedMethods.showErrorToast(
            this.t('indicators.formulas.grau_endeutament_bancari.missing_fields')
        );
        return;
      }

      return modalController.dismiss({
        data_store: {
          deute_total: Number(this.deute_total),
          facturacio_anual: Number(this.facturacio_anual),
        },
        result: Number(this.result)
      }, 'update');
    },
  },
  computed: {
    result() {
      let grauEndeutament = Number(this.deute_total) / Number(this.facturacio_anual) * 100;
      if (isNaN(grauEndeutament) || !isFinite(grauEndeutament)) {
        return '-';
      }

      return grauEndeutament.toFixed(2);
    }
  }
});
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}
</style>
