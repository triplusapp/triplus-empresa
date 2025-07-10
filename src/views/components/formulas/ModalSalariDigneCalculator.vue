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

    <h1 class="modal-title">{{ $t('indicators.formulas.salari_digne.title') }}</h1>
    <p>{{ $t('indicators.formulas.salari_digne.message') }}</p>

    <div style="margin-bottom: 1rem;">

      <ion-label>{{ $t('indicators.formulas.salari_digne.method_label') }}:</ion-label>
      <ion-radio-group v-model="input_method">
        <div class="item-radio" key="individual">
          <ion-radio name="radio_options" value="individual" slot="start"></ion-radio>
          <ion-label class="label-radio">{{ $t('indicators.formulas.salari_digne.method_single') }}:</ion-label>
          <small>{{ $t('indicators.formulas.salari_digne.method_single_info') }}</small>
        </div>
        <div class="item-radio" key="aggregate">
          <ion-radio name="radio_options" value="aggregate" slot="start"></ion-radio>
          <ion-label class="label-radio">{{ $t('indicators.formulas.salari_digne.method_aggregated') }}:</ion-label>
          <small>{{ $t('indicators.formulas.salari_digne.method_aggregated_info') }}</small>
        </div>
      </ion-radio-group>
    </div>

    <div v-show="centres_treball.length>0" v-if="input_method==='individual'">
      <div v-for="(centreTreball, key) in centres_treball" :key="key" class="centre-treball">
        <ion-grid class="centre-treball-info">
          <ion-row>
            <ion-col>
              <ion-select
                  class="input-custom"
                  fill="solid"
                  label-placement="floating"
                  label="Comarca"
                  v-model="centreTreball.comarca"
                  placeholder="Selecciona una comarca">
                <ion-select-option v-for="comarca in comarques" :value="comarca.nom_comarca">
                  {{ comarca.nom_comarca }}
                </ion-select-option>
              </ion-select>
            </ion-col>
            <ion-col>
              <ion-input
                  class="input-custom"
                  fill="solid"
                  label-placement="floating"
                  :label="$t('indicators.formulas.salari_digne.num_treballadors')"
                  type="number"
                  step="1"
                  min="1"
                  v-model="centreTreball.num_treballadors" placeholder="Ex: 4"/>

              <div>
                <ion-input
                    class="input-custom input-salari-treballador"
                    fill="solid"
                    label-placement="floating"
                    v-for="(n,i) in Number(centreTreball.num_treballadors)" :key="i"
                    :label="$t('indicators.formulas.salari_digne.salari_num_treballador', {num: n})"
                    onwheel="return false;"
                    placeholder="0"
                    type="number"
                    v-model="centreTreball.treballadors[i]"
                    min="0" step="1"/>
              </div>
            </ion-col>
            <ion-col style="text-align: right;" size="auto">
              <ion-button type="button" size="small" fill="clear" color="danger" @click=removeCentreTreball(key)>
                <ion-icon :icon="trashBinIcon()"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </div>

    <div v-show="centres_treball_aggregate.length>0" v-if="input_method==='aggregate'">
      <div v-for="(centreTreball, key) in centres_treball_aggregate" :key="key" class="centre-treball">
        <ion-grid class="centre-treball-info">
          <ion-row>
            <ion-col>
              <ion-select placeholder="Selecciona una comarca" v-model="centreTreball.comarca" fill="outline"
                          label-placement="stacked" label="Comarca">
                <ion-select-option v-for="comarca in comarques" :value="comarca.nom_comarca">
                  {{ comarca.nom_comarca }}
                </ion-select-option>
              </ion-select>
            </ion-col>
            <ion-col style="text-align: right;" size="auto">
              <ion-button type="button" size="small" fill="clear" color="danger" @click=removeCentreTreball(key)>
                <ion-icon :icon="trashBinIcon()"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>

        <div v-for="(row,i) in centreTreball.salaris_agregats" :key="i">
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-input
                    :label="$t('indicators.formulas.salari_digne.salari_label')"
                    label-placement="stacked"
                    fill="outline"
                    onwheel="return false;"
                    placeholder="0"
                    type="number"
                    v-model="row.salari"
                    min="0" step="1"/>
              </ion-col>
              <ion-col>
                <ion-input
                    :label="$t('indicators.formulas.salari_digne.num_treballadors')"
                    type="number" step="1" min="1"
                    label-placement="stacked" fill="outline"
                    v-model="row.num_treballadors" placeholder="Ex: 4"/>
              </ion-col>
              <ion-col style="text-align: right;" size="auto">
                <ion-button type="button" size="small" fill="clear" color="danger" @click="removeSalariAgregat(key, i)">
                  <ion-icon :icon="trashBinIcon()"></ion-icon>
                </ion-button>
              </ion-col>

            </ion-row>
          </ion-grid>
        </div>

        <div style="margin-left: 10px;">
          <ion-button type="button" fill="outline" color="medium" @click="addSalariAgregat(key)"
                      style="margin-bottom: 1.5rem;"
                      size="small">
            <ion-icon slot="start" :icon="addIcon()"></ion-icon>
            {{ $t('indicators.formulas.salari_digne.add_row') }}
          </ion-button>
        </div>
      </div>
    </div>

    <div style="text-align: right;">
      <ion-button type="button" fill="outline" @click="addCentreTreballCurrentMethod" style="margin-bottom: 1.5rem;"
                  size="small"
                  shape="round">
        <ion-icon slot="start" :icon="addIcon()"></ion-icon>
        {{ $t('indicators.formulas.salari_digne.add_centre') }}
      </ion-button>
    </div>

    <br>
    {{ $t('indicators.formulas.salari_digne.result') }}: {{ result }}

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
  IonLabel,
  IonRadio,
  IonRadioGroup,
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
    }
  },
  data() {
    return {
      input_method: null,
      centres_treball: [],
      centres_treball_aggregate: [],
      comarques: [],
      required_num_workers: null
    }
  },
  components: {
    IonContent, IonGrid, IonFooter, IonTitle, IonToolbar,
    IonRadioGroup, IonRadio, IonLabel,
    IonButtons, IonButton,
    IonCheckbox,
    IonCol, IonRow,
    IonIcon,
    IonInput,
    IonItem,
    IonSelect, IonSelectOption,
    modalController,
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
      if (this.checkIfRequiredNumWorkersMismatch()) {
        SharedMethods.showErrorToast(
            this.t('indicators.formulas.salari_digne.num_workers_missmatch')
        );
        return;
      }
      if (!this.allFieldsAreFilled()) {
        SharedMethods.showErrorToast(
            this.t('indicators.formulas.salari_digne.missing_fields')
        );
        return;
      }

      return modalController.dismiss({
        data_store: {
          centres_treball: this.centres_treball,
          centres_treball_aggregate: this.centres_treball_aggregate,
          input_method: this.input_method,
        },
        result: Number(this.result)
      }, 'update');
    },

    removeCentreTreball(key) {
      if (this.input_method === 'individual') {
        this.centres_treball.splice(key, 1);
      }
      if (this.input_method === 'aggregate') {
        this.centres_treball_aggregate.splice(key, 1);
      }
    },
    addCentreTreballIndividual() {
      this.centres_treball.push({
        comarca: null,
        num_treballadors: null,
        treballadors: [],
      })
    },
    addSalariAgregat(centreTreballKey) {
      this.centres_treball_aggregate[centreTreballKey].salaris_agregats.push({
        num_treballadors: '',
        salari: '',
      })
    },
    removeSalariAgregat(centreTreballKey, i) {
      this.centres_treball_aggregate[centreTreballKey].salaris_agregats.splice(i, 1);
    },
    addCentreTreballAggregate() {
      this.centres_treball_aggregate.push({
        comarca: null,
        salaris_agregats: [{
          num_treballadors: '',
          salari: '',
        }],
      })
    },
    addCentreTreballCurrentMethod() {
      if (this.input_method === 'individual') {
        this.addCentreTreballIndividual();
      }
      if (this.input_method === 'aggregate') {
        this.addCentreTreballAggregate();
      }
    },

    // Càlculs
    isValidIndividualSalaries() {
      if (this.centres_treball.length === 0) {
        return false;
      }

      for (let centreTreballKey in this.centres_treball) {
        const centreTreball = this.centres_treball[centreTreballKey];

        if (!centreTreball.comarca) {
          return false;
        }

        const comarca = this.comarques.find((comarca) => comarca.nom_comarca == centreTreball.comarca);
        if (!comarca) {
          return false;
        }

        if (centreTreball.num_treballadors == '' || isNaN(centreTreball.num_treballadors)) {
          return false;
        }

        if (centreTreball.treballadors.length < centreTreball.num_treballadors) {
          return false;
        }

        if (centreTreball.treballadors.length > centreTreball.num_treballadors) {
          centreTreball.treballadors.splice(centreTreball.num_treballadors);
        }

        if (centreTreball.treballadors.length > centreTreball.num_treballadors) {
          centreTreball.treballadors.length = centreTreball.num_treballadors;
          return false;
        }

        for (let treballadorKey in centreTreball.treballadors) {
          const salariTreballador = centreTreball.treballadors[treballadorKey];
          if (isNaN(salariTreballador)) {
            return false;
          }
        }
      }

      return true;
    },
    calcularIndividualSalaries() {
      let comarques = this.comarques;
      let desviacions = this.centres_treball.flatMap(function (centreTreball) {
        const salariReferencia = Number(comarques.find((comarca) => comarca.nom_comarca == centreTreball.comarca).salari);
        return centreTreball.treballadors.map(function (salariTreballador) {
          return 100 - (Number(salariTreballador) * 100) / salariReferencia;
        });
      });
      const totalDesviacions = desviacions.reduce((acc, valor) => acc + valor, 0);
      const mitjanaDesviacio = totalDesviacions / desviacions.length;

      if (isNaN(mitjanaDesviacio) || !isFinite(mitjanaDesviacio)) {
        return 0;
      }

      return mitjanaDesviacio.toFixed(2);
    },

    isValidAggregatedSalaries() {
      if (this.centres_treball_aggregate.length === 0) {
        return false;
      }

      for (let centreTreballKey in this.centres_treball_aggregate) {
        const centreTreball = this.centres_treball_aggregate[centreTreballKey];

        if (!centreTreball.comarca) {
          return false;
        }

        const comarca = this.comarques.find((comarca) => comarca.nom_comarca == centreTreball.comarca);
        if (!comarca) {
          return false;
        }
        if (centreTreball.salaris_agregats.length === 0) {
          return false;
        }

        for (let row of centreTreball.salaris_agregats) {
          if (row.num_treballadors == '' || isNaN(row.num_treballadors)) {
            return false;
          }

          if (row.salari == '' || isNaN(row.salari)) {
            return false;
          }
        }
      }

      return true;
    },
    calcularAggregatedSalaries() {
      let comarques = this.comarques;
      let desviacions = this.centres_treball_aggregate.flatMap(function (centreTreball) {
        const salariReferencia = Number(comarques.find((comarca) => comarca.nom_comarca == centreTreball.comarca).salari);

        let salarisTreballadors = [];
        centreTreball.salaris_agregats.forEach((salaris_agregat) => {
          for (let i = 0; i < salaris_agregat.num_treballadors; i++) {
            salarisTreballadors.push(salaris_agregat.salari);
          }
        });

        return salarisTreballadors.map(function (salariTreballador) {
          return 100 - (Number(salariTreballador) * 100) / salariReferencia;
        });
      });
      const totalDesviacions = desviacions.reduce((acc, valor) => acc + valor, 0);
      const mitjanaDesviacio = totalDesviacions / desviacions.length;

      if (isNaN(mitjanaDesviacio) || !isFinite(mitjanaDesviacio)) {
        return 0;
      }

      return mitjanaDesviacio.toFixed(2);
    },
    async fetchCompanyRequiredNumWorkers() {
      TraceabilityApiMethods.fetchCompany().then((companyData) => this.required_num_workers = companyData.num_workers)
    },
    allFieldsAreFilled() {
      if (this.input_method === 'individual') {
        // Comprova si tots els centres de treball tenen tots els salaris omplerts.
        return this.centres_treball.every(centre => {
          // Comprova si el camp comarca no és null
          if (centre.comarca == null || centre.comarca === '') {
            return false;
          }

          // Comprova si tots els salaris estan omplerts
          if (centre.treballadors.length !== parseInt(centre.num_treballadors)) {
            return false;
          }
          return centre.treballadors.every((salariTreballador) => salariTreballador != null && salariTreballador !== '');
        });
      }
      if (this.input_method === 'aggregate') {
        return this.centres_treball_aggregate.every(centre => {
          // Comprova si el camp comarca no és null
          if (centre.comarca == null || centre.comarca === '') {
            return false;
          }

          // Comprova si tots els salaris estan omplerts
          return centre.salaris_agregats.every(salariAgregat => {
            return salariAgregat.salari != null && salariAgregat.salari !== '';
          });
        });
      }
    },
    checkIfRequiredNumWorkersMismatch() {
      let totalWorkers = 0;
      if (this.input_method === 'individual') {
        totalWorkers = this.centres_treball
            .map(centreTreball => parseInt(centreTreball.num_treballadors))
            .reduce((acc, valorActual) => acc + valorActual, 0);
      }
      if (this.input_method === 'aggregate') {
        totalWorkers = this.centres_treball_aggregate
            .flatMap(function (centreTreball) {
              return centreTreball.salaris_agregats.map((salaris_agregat) => parseInt(salaris_agregat.num_treballadors));
            })
            .reduce((acc, valorActual) => acc + valorActual, 0);
      }

      if (this.required_num_workers && this.required_num_workers != totalWorkers) {
        return true;
      }
      return false;
    }
  },
  computed: {
    result() {
      if (this.input_method === 'individual' && this.isValidIndividualSalaries()) {
        return this.calcularIndividualSalaries();
      }
      if (this.input_method === 'aggregate' && this.isValidAggregatedSalaries()) {
        return this.calcularAggregatedSalaries();
      }
      return 0;
    },
    required_num_workers_missmatch() {
      return this.checkIfRequiredNumWorkersMismatch();
    }
  },
  created() {
    TraceabilityApiMethods.fetchFormulaSalariDigne()
        .then((data) => this.comarques = data);

    this.input_method = this.data_store?.input_method ?? 'individual';
    this.centres_treball = this.data_store?.centres_treball ?? [];
    this.centres_treball_aggregate = this.data_store?.centres_treball_aggregate ?? [];
    if (this.centres_treball.length === 0) {
      this.addCentreTreballIndividual();
    }
    if (this.centres_treball_aggregate.length === 0) {
      this.addCentreTreballAggregate();
    }
    this.fetchCompanyRequiredNumWorkers();
  }
});
</script>

<style scoped>
.centre-treball {
  margin-bottom: 1.5rem;
  /*border: 1px solid rgba(0, 0, 0, 0.2);*/
}

.hr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  margin: 0 15px;
}

/*
.centre-treball-info {
  background: rgb(247, 247, 247);
}*/

.treballadors-list {
  padding-left: 1rem;
}

.item-radio {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.label-radio {
  padding: 0 5px;
}

.input-salari-treballador {
  margin-top: 1rem;
}
</style>
