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

    <h1 class="modal-title">{{ $t('indicators.formulas.aprofitament_aigues_pluvials.title') }}</h1>
    <p>{{ $t('indicators.formulas.aprofitament_aigues_pluvials.message') }}</p>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.aprofitament_aigues_pluvials.superficie_explotacio')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="superficie_explotacio"
          min="0" step="1"/>
    </div>
    <h5>{{ $t('indicators.formulas.aprofitament_aigues_pluvials.superficie_sistemes') }}</h5>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.aprofitament_aigues_pluvials.captacio_teulades')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="captacio_teulades"
          min="0" step="1"/>

      <div class="help-text-wrapper">
        <ion-icon :icon="informationCircleOutline()"></ion-icon>
        <small>{{ $t('indicators.formulas.aprofitament_aigues_pluvials.captacio_teulades_help_text') }}</small>
      </div>
    </div>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.aprofitament_aigues_pluvials.diposits')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="diposits"
          min="0" step="1"/>

      <div class="help-text-wrapper">
        <ion-icon :icon="informationCircleOutline()"></ion-icon>
        <small>{{ $t('indicators.formulas.aprofitament_aigues_pluvials.diposits_help_text') }}</small>
      </div>
    </div>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.aprofitament_aigues_pluvials.murs')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="murs"
          min="0" step="1"/>
      <div class="help-text-wrapper">
        <ion-icon :icon="informationCircleOutline()"></ion-icon>
        <small>{{ $t('indicators.formulas.aprofitament_aigues_pluvials.murs_help_text') }}</small>
      </div>
    </div>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.aprofitament_aigues_pluvials.feixes')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="feixes"
          min="0" step="1"/>
      <div class="help-text-wrapper">
        <ion-icon :icon="informationCircleOutline()"></ion-icon>
        <small>{{ $t('indicators.formulas.aprofitament_aigues_pluvials.feixes_help_text') }}</small>
      </div>
    </div>

    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.aprofitament_aigues_pluvials.cultiu')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="cultiu"
          min="0" step="1"/>
      <div class="help-text-wrapper">
        <ion-icon :icon="informationCircleOutline()"></ion-icon>
        <small>{{ $t('indicators.formulas.aprofitament_aigues_pluvials.cultiu_help_text') }}</small>
      </div>
    </div>

    <div>
      {{ $t('indicators.formulas.aprofitament_aigues_pluvials.result') }}: {{ result }}%
    </div>
    <br>

  </ion-content>
</template>

<script lang="ts">
import SharedMethods from "@/shared/SharedMethods.js";
import {useI18n} from "vue-i18n";
import {
  IonIcon,
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
import {informationCircleOutline} from "ionicons/icons";

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
      superficie_explotacio: this.data_store?.superficie_explotacio,
      captacio_teulades: this.data_store?.captacio_teulades,
      diposits: this.data_store?.diposits,
      murs: this.data_store?.murs,
      feixes: this.data_store?.feixes,
      cultiu: this.data_store?.cultiu,
    }
  },
  components: {
    IonContent,
    IonFooter,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonInput,
    IonCheckbox,
    IonIcon
  },
  methods: {
    informationCircleOutline() {
      return informationCircleOutline
    },
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    update() {
      const superficieExplotacio = this.superficieExplotacio();
      if (isNaN(superficieExplotacio) || !isFinite(superficieExplotacio)) {
        SharedMethods.showErrorToast(
            this.t('indicators.formulas.aprofitament_aigues_pluvials.invalid_numbers_error')
        );
        return;
      }
      const sumatori = this.sumatoriSuperficies();
      if (isNaN(sumatori) || !isFinite(sumatori)) {
        SharedMethods.showErrorToast(
            this.t('indicators.formulas.aprofitament_aigues_pluvials.invalid_numbers_error')
        );
        return;
      }

      if (sumatori > superficieExplotacio) {
        SharedMethods.showErrorToast(
            this.t('indicators.formulas.aprofitament_aigues_pluvials.sistemes_bigger_than_area_error')
        );
        return;
      }


      return modalController.dismiss({
        data_store: {
          superficie_explotacio: Number(this.superficie_explotacio),
          captacio_teulades: Number(this.captacio_teulades),
          diposits: Number(this.diposits),
          murs: Number(this.murs),
          feixes: Number(this.feixes),
          cultiu: Number(this.cultiu),
        },
        result: Number(this.result)
      }, 'update');
    },
    sumatoriSuperficies() {
      return Number(this.captacio_teulades) + Number(this.diposits) + Number(this.murs) + Number(this.feixes) + Number(this.cultiu);
    },
    superficieExplotacio() {
      return Number(this.superficie_explotacio);
    }
  },
  computed: {
    result() {
      const sumatori = this.sumatoriSuperficies();
      const superficieExplotacio = this.superficieExplotacio();
      let aprofitament = (sumatori / superficieExplotacio) * 100;
      if (isNaN(aprofitament) || !isFinite(aprofitament)) {
        return '-';
      }
      return aprofitament.toFixed(2);
    }
  }
});
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.2rem;
}

.help-text-wrapper {
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
  gap: 0.3rem;
}
</style>
