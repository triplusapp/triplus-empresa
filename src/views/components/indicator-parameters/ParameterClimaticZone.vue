<template>
  <div>

    <ion-label>
      {{ $t('indicators.parameters.climatic_zone.title') }}
    </ion-label>

    <div v-show="indicator?.evaluation_parameter.formula" style="margin-bottom: 0.5rem;">
      <ion-button type="button" size="small" fill="outline" @click="openCalculator" shape="round">
        <ion-icon slot="start" :icon="calculator"></ion-icon>
        {{ $t('indicators.open_calculator') }}
      </ion-button>
      <div>
        <small v-show="isDisabledByFormula">{{ disabledByFormulaMessage }}</small>
      </div>
    </div>

    <ion-input
        class="input-custom input-number"
        fill="solid"
        label-placement="floating"
        :label="$t('indicators.answer')"
        v-model="indicatorClimaticZoneTypeForm.energy_consumption"
        onwheel="return false;"
        :disabled="isDisabledByFormula"
        type="number"
        min="0"
        placeholder="0"
        step="1"/>
    <ValidationTextError :show="errorFields.includes('indicatorClimaticZoneTypeForm.energy_consumption')" />

    <p>{{ $t('indicators.parameters.climatic_zone.info') }}</p>

    <ion-select
        class="input-custom" fill="solid" label-placement="stacked"
        :label="$t('indicators.parameters.climatic_zone.edificacio')"
        v-model="indicatorClimaticZoneTypeForm.edificacio_id">
      <ion-select-option v-for="edificacio in edificacions" :value="edificacio.id">
        {{ edificacio.name }} ({{ edificacio.type.name }})
      </ion-select-option>
    </ion-select>
    <ValidationTextError :show="errorFields.includes('indicatorClimaticZoneTypeForm.edificacio_id')" />

  </div>
</template>

<script setup>
import {defineProps, ref} from 'vue';
import {IonButton, IonIcon, IonInput, IonLabel, IonSelect, IonSelectOption} from '@ionic/vue';
import {calculator} from 'ionicons/icons';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorClimaticZoneTypeForm: Object,
  openCalculator: Function,
  isDisabledByFormula: Boolean,
  disabledByFormulaMessage: String,
});

const edificacions = ref([]);
const fetchEdificacions = async () => {
  TraceabilityApiMethods.fetchEdificacions().then((edificacionsResponse) => {
    edificacions.value = edificacionsResponse.sort((a, b) => {
      if (a.type.name !== b.type.name) { // group per type
        return a.type.name.localeCompare(b.type.name);
      }
      return a.name.localeCompare(b.name); // order by name
    });
  })
}
fetchEdificacions();

</script>

<style scoped>
</style>
