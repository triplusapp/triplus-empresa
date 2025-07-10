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
    <h1 class="modal-title">{{ $t('indicators.formulas.centre_treball_multiples_percentages.title') }}</h1>
    <p>{{ $t('indicators.formulas.centre_treball_multiples_percentages.message') }}</p>

    <div>{{ $t('indicators.formulas.centre_treball_multiples_percentages.num_teletreball_info') }}</div>
    <div class="input-wrapper">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.formulas.centre_treball_multiples_percentages.num_teletreball_label')"
          onwheel="return false;"
          placeholder="0"
          type="number"
          v-model="num_teletreball"
          min="0" step="1"/>
    </div>

    <p class="alert-info" v-show="required_num_workers_missmatch">
      <ion-icon size="large" :icon="infoBinIcon()"></ion-icon>
        <span>
        {{
          $t('indicators.formulas.centre_treball_multiples_percentages.info_num_workers', {
            num_workers: this.required_num_workers,
            total: this.requiredNumWorkersMinusRemoteWork,
            num_teletreball: this.num_teletreball,
          })
        }}
        </span>
    </p>

    <div v-show="centres_treball.length>0 && num_teletreball<required_num_workers">
      <div v-for="(centreTreball, key) in centres_treball" :key="key" class="centre-treball">
        <div style="display: flex;align-items: center;gap: 1rem;">

          <ion-select
              class="input-custom" fill="solid" label-placement="stacked"
              :label="$t('indicators.formulas.centre_treball_multiples_percentages.location_and_name_label')"
              v-model="centreTreball.edificacio_id">
            <ion-select-option v-for="edificacio in edificacions" :value="edificacio.id">
              {{ edificacio.name }} ({{ edificacio.type.name }})
            </ion-select-option>
          </ion-select>

          <ion-button type="button" size="small" fill="clear" color="danger"
                      @click="removeCentreTreball(key)">
            {{ $t('indicators.formulas.centre_treball_multiples_percentages.delete') }}
          </ion-button>
        </div>

        <div>
          <div v-for="(workerOption, workersOptionsKey) in centreTreball.workersOptions" :key="workersOptionsKey"
               style=" display: flex;justify-content: space-between;align-items: center; gap: 1rem;">
            <div style=" flex: 0 0 260px;margin: 1rem 0;">
              <ion-select
                  class="input-custom" fill="solid" label-placement="stacked"
                  :label="$t('indicators.formulas.centre_treball_multiples_percentages.option')"
                  v-model="workerOption.option_id">
                <ion-select-option v-for="option in indicatorOptions" :value="option.option_id">
                  {{ option.name }}
                </ion-select-option>
              </ion-select>
            </div>
            <div style=" flex: 0 0 180px;">
              <ion-input
                  class="input-custom" fill="solid" label-placement="stacked"
                  :label="$t('indicators.formulas.centre_treball_multiples_percentages.num_workers')"
                  type="number" step="1" min="1"
                  v-model="workerOption.num_workers" placeholder="Ex: 4"/>
            </div>
            <div style="flex:1;flex-grow: 1;">
              <ion-button type="button" size="small" fill="clear" color="danger"
                          @click="removeWorkerOption(centreTreball, workersOptionsKey)">
                <ion-icon :icon="trashBinIcon()"></ion-icon>
              </ion-button>
            </div>
          </div>
        </div>

        <ion-button type="button" fill="outline" @click="addWorkersOption(centreTreball)"
                    style="margin-bottom: 1.5rem;" size="small">
          <ion-icon slot="start" :icon="addIcon()"></ion-icon>
          {{ $t('indicators.formulas.centre_treball_multiples_percentages.add_option_btn') }}
        </ion-button>
      </div>
    </div>


    <div style="text-align: right;" v-show="num_teletreball<required_num_workers">
      <ion-button type="button" fill="outline" @click="addCentreTreball" style="margin-bottom: 1.5rem;" size="small">
        <ion-icon slot="start" :icon="addIcon()"></ion-icon>
        {{ $t('indicators.formulas.centre_treball_multiples_percentages.add_centre_btn') }}
      </ion-button>
    </div>

    <h5>{{ $t('indicators.formulas.centre_treball_multiples_percentages.result') }}</h5>
    <ion-grid style="padding: 0;">
      <ion-row v-for="(row) in result">
        <ion-col>{{ row.name }}</ion-col>
        <ion-col>{{ row.num_workers_percentage }}%</ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script lang="ts">
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
  modalController
} from '@ionic/vue';

import {add, trashBin, informationCircleOutline} from 'ionicons/icons';

import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import {defineComponent} from 'vue';
import {useI18n} from "vue-i18n";

export default defineComponent({
  setup() {
    const {t} = useI18n();
    return {t};
  },
  props: {
    data_store: {
      type: Object,
    },
    indicatorOptions: {
      type: Array,
    },
  },
  data() {
    return {
      centres_treball: [],
      required_num_workers: null,
      num_teletreball: 0,
      edificacions: null,
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
    infoBinIcon() {
      return informationCircleOutline
    },
    addIcon() {
      return add
    },
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    update() {
      if (this.checkIfRequiredNumWorkersMismatch()) {
        SharedMethods.showErrorToast(
            this.t('indicators.formulas.centre_treball_multiples_percentages.num_workers_missmatch')
        );
        return;
      }

      return modalController.dismiss({
        data_store: {
          centres_treball: this.centres_treball,
          num_teletreball: this.num_teletreball
        },
        result: this.result.map(row => ({
          option_id: row.option_id,
          percentage: row.num_workers_percentage,
        }))
      }, 'update');
    },

    calcular() {
      let allWorkersOptions = this.centres_treball
          .flatMap(centreTreball => centreTreball.workersOptions.map(workersOptions => workersOptions))
          .filter(workersOptions => (workersOptions.option_id && !isNaN(workersOptions.num_workers)));

      let optionsWithNumWorkers = this.indicatorOptions.map(indicatorOption => {
        let numWorkersCurrentOption = allWorkersOptions
            .filter((workerOptions) => workerOptions.option_id == indicatorOption.option_id)
            .map(workerOptions => Number(workerOptions.num_workers))
            .reduce((a, b) => a + b, 0);

        indicatorOption.num_workers = numWorkersCurrentOption;
        return indicatorOption;
      });

      let numTotalWorkers = optionsWithNumWorkers.reduce((a, b) => a + b.num_workers, 0);
      optionsWithNumWorkers = optionsWithNumWorkers.map((optionWithNumWorkers) => {
        optionWithNumWorkers.num_workers_percentage = 0;
        if (optionWithNumWorkers.num_workers > 0) {
          optionWithNumWorkers.num_workers_percentage = Number(optionWithNumWorkers.num_workers / numTotalWorkers * 100).toFixed(2)
        }
        return optionWithNumWorkers;
      });

      return optionsWithNumWorkers;
    },

    removeCentreTreball(key) {
      this.centres_treball.splice(key, 1);
    },
    removeWorkerOption(centreTreball, workersOptionsKey) {
      centreTreball.workersOptions.splice(workersOptionsKey, 1);
    },

    addCentreTreball() {
      this.centres_treball.push({
        name: null,
        workersOptions: [],
      });
      this.addWorkersOption(this.centres_treball[this.centres_treball.length - 1])
    },
    addWorkersOption(centreTreball) {
      centreTreball.workersOptions.push({
        option_id: null,
        num_workers: null,
      })
    },
    async fetchCompanyRequiredNumWorkers() {
      TraceabilityApiMethods.fetchCompany().then((companyData) => this.required_num_workers = companyData.num_workers)
    },
    async fetchEdificacions() {
      TraceabilityApiMethods.fetchEdificacions().then((edificacions) => {
        this.edificacions = edificacions.sort((a, b) => {
          if (a.type.name !== b.type.name) { // group per type
            return a.type.name.localeCompare(b.type.name);
          }
          return a.name.localeCompare(b.name); // order by name
        });
      })
    },
    checkIfRequiredNumWorkersMismatch() {
      let totalWorkers = 0;
      this.centres_treball.forEach(center => {
        center.workersOptions.forEach(option => {
          totalWorkers += parseInt(option.num_workers, 10); // Convertim 'num_workers' a número i l'afegim al total
        });
      });

      if (this.requiredNumWorkersMinusRemoteWork && this.requiredNumWorkersMinusRemoteWork != totalWorkers) {
        return true;
      }
      return false;
    }
  },
  computed: {
    result() {
      return this.calcular();
    },
    required_num_workers_missmatch() {
      return this.checkIfRequiredNumWorkersMismatch();
    },
    requiredNumWorkersMinusRemoteWork() {
      return this.required_num_workers - this.num_teletreball;
    }
  },
  watch: {
    num_teletreball(newValue) {
      if (newValue == this.required_num_workers) {
        this.centres_treball = [];
      }
    }
  },
  mounted() {
    this.centres_treball = [...(this.data_store?.centres_treball ?? [])];
    this.num_teletreball = this.data_store?.num_teletreball ?? 0;

    if (this.centres_treball.length === 0) {
      this.addCentreTreball();
    }

    this.fetchCompanyRequiredNumWorkers();
    this.fetchEdificacions();
  }
});
</script>

<style scoped>
.input-wrapper {
  margin: 1rem 0;
}

.centre-treball {
  margin-bottom: 1.5rem;
}

.alert-info {
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.1rem;
}

.alert-info span {
  font-size: 0.85rem;
}
</style>
