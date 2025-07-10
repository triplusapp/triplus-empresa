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
    <h1 class="modal-title">{{ $t('indicators.formulas.heterogeneitat_espacial_explotacio.title') }}</h1>
    <p>{{ $t('indicators.formulas.heterogeneitat_espacial_explotacio.message') }}</p>

    <div v-show="comunitats_percentatge.length>0">
      <div v-for="(comunitatPercentatge, key) in comunitats_percentatge" :key="key" class="comunitat-vegetal">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-select
                  :label="$t('indicators.formulas.heterogeneitat_espacial_explotacio.comunitat_vegetal')"
                  class="input-custom"
                  fill="solid"
                  label-placement="floating"
                  v-model="comunitatPercentatge.comunitat"
                  :placeholder="$t('indicators.formulas.heterogeneitat_espacial_explotacio.comunitat_vegetal_placeholder')"
              >
                <ion-select-option v-for="comunitatVegetal in comunitats_options"
                                   :value="comunitatVegetal.nom_comunitat">
                  {{ comunitatVegetal.nom_comunitat }}
                </ion-select-option>
              </ion-select>
            </ion-col>
            <ion-col>
              <ion-input
                  class="input-custom"
                  fill="solid"
                  label-placement="floating"
                  :label="$t('indicators.formulas.heterogeneitat_espacial_explotacio.percentage')"
                  type="number" step="1" min="1" max="100"
                  v-model="comunitatPercentatge.percentatge" placeholder="Ex: 25"/>
            </ion-col>
            <ion-col style="text-align: right;" size="auto">
              <ion-button type="button" size="small" fill="clear" color="danger" @click=removeComunitatPercentage(key)>
                <ion-icon :icon="trashBinIcon()"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </div>

    <div style="text-align: right;">
      <ion-button type="button" fill="outline" @click="addComunitatPercentage" style="margin-bottom: 1.5rem;"
                  size="small" shape="round">
        <ion-icon slot="start" :icon="addIcon()"></ion-icon>
        {{ $t('indicators.formulas.heterogeneitat_espacial_explotacio.add_comunitat_vegetal_btn') }}
      </ion-button>
    </div>

    <br>

    <div style="margin-bottom: 5px;"><strong>Resultat</strong></div>
    <div v-if="!canBeCalculated">
      <div>{{ $t('indicators.formulas.heterogeneitat_espacial_explotacio.result_comunitat_vegetal_principal') }}: -</div>
      <div>{{ $t('indicators.formulas.heterogeneitat_espacial_explotacio.result_sum_comunitat_vegetal') }}: -</div>
    </div>
    <div v-if="canBeCalculated">
      <div>{{ $t('indicators.formulas.heterogeneitat_espacial_explotacio.result_comunitat_vegetal_principal') }}: {{ ocupacio_principal }}%</div>
      <div>{{ $t('indicators.formulas.heterogeneitat_espacial_explotacio.result_sum_comunitat_vegetal') }}: {{ ocupacio_principal_2 }}%</div>
      <div style="margin-top: 10px; margin-bottom: 0;font-size: 0.9rem;"
           class="alert alert-info">{{ $t('indicators.formulas.heterogeneitat_espacial_explotacio.result_close_btn') }}</div>
    </div>
  </ion-content>
</template>

<script lang="ts">
import SharedMethods from "@/shared/SharedMethods.js";

import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonFooter,
  IonIcon,
  IonInput,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import {defineComponent} from 'vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {add, trashBin} from "ionicons/icons";

export default defineComponent({
  props: {
    data_store: {
      type: Object
    }
  },
  data() {
    return {
      comunitats_percentatge: [],
      comunitats_options: [],
      ocupacio_principal: null,
      ocupacio_principal_2: null
    }
  },
  components: {
    IonSelect, IonSelectOption,
    IonIcon,
    IonRow,
    IonGrid,
    IonCol,
    IonContent, IonFooter, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonCheckbox
  },
  methods: {
    trashBinIcon() {
      return trashBin
    },
    addIcon() {
      return add
    },
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    update() {
      if (!this.canBeCalculated) {
        SharedMethods.showErrorToast('La suma dels percentatges no és igual al 100%')
        return;
      }
      return modalController.dismiss({
        data_store: {
          comunitats_percentatge: this.comunitats_percentatge,
        },
        result: null
      }, 'update');
    },

    isValid() {
      if (this.comunitats_percentatge.length === 0) {
        return false;
      }

      let percentatges = [];

      for (let key in this.comunitats_percentatge) {
        const row = this.comunitats_percentatge[key];

        if (!row.comunitat) {
          return false;
        }

        const selectedComunitat = this.comunitats_options.find((comunitat) => comunitat.nom_comunitat == row.comunitat);
        if (!selectedComunitat) {
          return false;
        }

        if (isNaN(row.percentatge)) {
          return false;
        }
        percentatges.push(Number(row.percentatge));
      }

      let sumPercentages = percentatges.reduce((a, b) => a + b, 0);
      return (sumPercentages == 100);
    },
    calcular() {

      let percentatges = [];
      for (let key in this.comunitats_percentatge) {
        const row = this.comunitats_percentatge[key];
        percentatges.push(Number(row.percentatge));
      }

      this.ocupacio_principal = Math.max(...percentatges);

      if (percentatges.length > 1) {
        percentatges.sort((a, b) => b - a);
        this.ocupacio_principal_2 = percentatges[0] + percentatges[1];
      } else {
        this.ocupacio_principal_2 = percentatges[0];
      }

    },
    removeComunitatPercentage(key) {
      this.comunitats_percentatge.splice(key, 1);
    },

    addComunitatPercentage() {
      this.comunitats_percentatge.push({
        comunitat: null,
        percentatge: null,
      })
    },
  },
  computed: {
    canBeCalculated() {
      if (this.isValid()) {
        this.calcular();
        return true;
      }
      this.ocupacio_principal = null;
      this.ocupacio_principal_2 = null;
      return false;
    },
  },
  mounted() {
    TraceabilityApiMethods.fetchFormulaHeterogeneitatEspacialExplotacio()
        .then((data) => this.comunitats_options = data);

    this.comunitats_percentatge = this.data_store?.comunitats_percentatge ?? [];
    if (this.comunitats_percentatge.length === 0) {
      this.addComunitatPercentage();
    }
  }
});
</script>

<style scoped>
.comunitat-vegetal {
  margin-bottom: 1rem;
}
</style>
