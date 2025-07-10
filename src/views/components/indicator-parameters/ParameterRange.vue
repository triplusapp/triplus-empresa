<template>
<div>
  <div v-show="indicator?.evaluation_parameter.formula">
    <ion-button type="button" size="small" fill="outline" @click="openCalculator" shape="round">
      <ion-icon slot="start" :icon="calculator"></ion-icon>
      {{ $t('indicators.open_calculator')}}
    </ion-button>
  </div>

  <small v-show="isDisabledByFormula">{{ disabledByFormulaMessage }}</small>
  <ion-input
      style="margin-top: 1.5rem;"
      class="input-custom input-number"
      fill="solid"
      label-placement="floating"
      :label="$t('indicators.parameters.range.answer')"
      :disabled="isDisabledByFormula"
      v-model="indicatorRangeTypeForm.value"
      onwheel="return false;"
      type="number"
      placeholder="0"
      step=".01"/>

  <ValidationTextError :show="errorFields.includes('indicatorRangeTypeForm.value')" />

</div>
</template>

<script setup>
import {IonButton, IonIcon, IonInput} from '@ionic/vue';

import {calculator} from 'ionicons/icons';
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorRangeTypeForm: Object,
  openCalculator: Function,
  isDisabledByFormula: Boolean,
  disabledByFormulaMessage: String,
});

</script>
