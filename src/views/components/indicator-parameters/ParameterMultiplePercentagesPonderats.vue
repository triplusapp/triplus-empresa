<template>
  <div>
    <ion-label>
      {{ $t('indicators.parameters.multiple_percentages_ponderats.info') }}
    </ion-label>

    <div v-show="indicator?.evaluation_parameter.formula" style="margin-bottom: 10px;">
      <ion-button type="button" size="small" fill="outline" @click="openCalculator" shape="round">
        <ion-icon slot="start" :icon="calculator"></ion-icon>
        {{ $t('indicators.open_calculator') }}
      </ion-button>
      <div>
        <small v-show="isDisabledByFormula">{{ disabledByFormulaMessage }}</small>
      </div>
    </div>

    <div v-for="option in indicator?.evaluation_parameter.options" :key="option.id">
      <ion-label class="ion-text-wrap">{{ option.name }}</ion-label>
      <ion-input
          class="input-custom input-number"
          fill="solid"
          label-placement="floating"
          :label="$t('indicators.parameters.multiple_percentages_ponderats.percentage')"
          :disabled="isDisabledByFormula"
          v-model="indicatorMultiplePercentagesPonderatsTypeForm.options[option.id]"
          onwheel="return false;"
          type="number"
          placeholder="0%"
          min="0" max="100" step="0.01"/>
      <ValidationTextError :show="errorFields.includes('indicatorMultiplePercentagesPonderatsTypeForm.'+option.id)" :error-message="$t('validations.numeric_field_required')"/>
      <br>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';
import {IonButton, IonIcon, IonInput, IonLabel} from '@ionic/vue';

import {calculator} from 'ionicons/icons';
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorMultiplePercentagesPonderatsTypeForm: Object,
  openCalculator: Function,
  isDisabledByFormula: Boolean,
  disabledByFormulaMessage: String,
});
</script>

