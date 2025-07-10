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
    <div v-if="escandall_complet">
      <h1 class="modal-title">{{ $t('indicators.formulas.escandall_costos.full_escandall_title') }}</h1>
      <p>{{ $t('indicators.formulas.escandall_costos.full_escandall_message') }}</p>
      <div class="input-wrapper">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.formulas.escandall_costos.benefici')"
            onwheel="return false;"
            placeholder="0"
            type="number"
            v-model="benefici"
            min="0" max="100" step=".1"/>
      </div>

      <div class="input-wrapper">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.formulas.escandall_costos.material')"
            onwheel="return false;"
            placeholder="0"
            type="number"
            v-model="material"
            min="0" max="100" step=".1"/>
      </div>

      <div class="input-wrapper">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.formulas.escandall_costos.personal')"
            onwheel="return false;"
            placeholder="0"
            type="number"
            v-model="personal"
            min="0" max="100" step=".1"/>
      </div>

      <div class="input-wrapper">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.formulas.escandall_costos.materies_primeres')"
            onwheel="return false;"
            placeholder="0"
            type="number"
            v-model="materies_primeres"
            min="0" max="100" step=".1"/>
      </div>

      <div class="input-wrapper">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.formulas.escandall_costos.despeses_estructurals')"
            onwheel="return false;"
            placeholder="0"
            type="number"
            v-model="despeses_estructurals"
            min="0" max="100" step=".1"/>
      </div>

      <div class="input-wrapper">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.formulas.escandall_costos.altres_despeses')"
            onwheel="return false;"
            placeholder="0"
            type="number"
            v-model="altres_despeses"
            min="0" max="100" step=".1"/>
      </div>

    </div>

    <div v-if="!escandall_complet">
      <h1 class="modal-title">{{ $t('indicators.formulas.escandall_costos.partial_escandall_title') }}</h1>
      <p>{{ $t('indicators.formulas.escandall_costos.partial_escandall_message') }}</p>
      <div class="input-wrapper">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.formulas.escandall_costos.benefici')"
            onwheel="return false;"
            placeholder="0"
            type="number"
            v-model="benefici"
            min="0" max="100" step=".1"/>
      </div>
      <div class="input-wrapper">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.formulas.escandall_costos.costos_produccio')"
            onwheel="return false;"
            placeholder="0"
            type="number"
            v-model="costos_produccio"
            min="0" max="100" step=".1"/>
        <small>{{ $t('indicators.formulas.escandall_costos.costos_produccio_help_text') }}</small>
      </div>

    </div>


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
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import {defineComponent} from 'vue';
import SharedMethods from "@/shared/SharedMethods.js";
import {useI18n} from "vue-i18n";

export default defineComponent({
  setup() {
    const {t} = useI18n();
    return {t};
  },
  props: {
    data_store: {
      type: Object
    },
    escandall_complet: {
      type: Boolean,
    }
  },
  data() {
    return {
      benefici: this.data_store?.benefici,
      costos_produccio: this.data_store?.costos_produccio,
      material: this.data_store?.material,
      personal: this.data_store?.personal,
      materies_primeres: this.data_store?.materies_primeres,
      despeses_estructurals: this.data_store?.despeses_estructurals,
      altres_despeses: this.data_store?.altres_despeses,
    }
  },
  components: {IonContent, IonFooter, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonCheckbox},
  methods: {
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    percentagesValidation() {
      let sum = 0;
      if (this.escandall_complet) {
        sum = (Number(this.benefici) +
            Number(this.material) +
            Number(this.personal) +
            Number(this.materies_primeres) +
            Number(this.despeses_estructurals) +
            Number(this.altres_despeses));
      } else {
        sum = (Number(this.benefici) + Number(this.costos_produccio));
      }
      const result = sum.toFixed(2);
      return Math.abs(result - 100) <= 0.01;
    },
    update() {
      if (!this.percentagesValidation()) {
        SharedMethods.showErrorToast(
            this.t('indicators.formulas.escandall_costos.error_percentages_message')
        );
        return;
      }
      let dataStore = null;
      if (this.escandall_complet) {
        dataStore = {
          escandall_complet: true,
          benefici: Number(this.benefici),
          material: Number(this.material),
          personal: Number(this.personal),
          materies_primeres: Number(this.materies_primeres),
          despeses_estructurals: Number(this.despeses_estructurals),
          altres_despeses: Number(this.altres_despeses),
        };
      } else {
        dataStore = {
          escandall_complet: false,
          benefici: Number(this.benefici),
          costos_produccio: Number(this.costos_produccio),
        };
      }

      return modalController.dismiss({
        data_store: dataStore,
      }, 'update');
    },
  },
  computed: {}
});
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}
</style>
