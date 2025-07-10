<template>
  <div>
    <div class="white-box">
      <ion-label>{{ indicator?.evaluation_parameter.options.question }}</ion-label>
      <ion-radio-group
          v-model="indicatorConditionalMultiplePercentagesPonderatsTypeForm.conditionalOptionId">
        <div v-for="option in indicator?.evaluation_parameter.options.option_answers"
             :key="option.option_id"
             class="item-radio">
          <ion-radio name="radio_options" :value="option.question_answer_id" slot="start"></ion-radio>
          <ion-label class="label-radio">{{ option.name }}</ion-label>
        </div>
      </ion-radio-group>
      <ValidationTextError :show="errorFields.includes('indicatorConditionalMultiplePercentagesPonderatsTypeForm.conditionalOptionId')" />
    </div>

    <div v-if="indicatorConditionalMultiplePercentagesPonderatsTypeForm.conditionalOptionId">
      <br>
      <ion-label>{{ $t('indicators.parameters.conditional_multiple_percentages_ponderats.info') }}</ion-label>

      <div v-show="indicator?.evaluation_parameter.formula" style="margin-bottom: 10px;">
        <ion-button type="button" size="small" fill="outline" @click="openCalculator" shape="round">
          <ion-icon slot="start" :icon="calculator"></ion-icon>
          {{ $t('indicators.open_calculator') }}
        </ion-button>
        <div>
          <small v-show="isDisabledByFormula">{{ disabledByFormulaMessage }}</small>
        </div>
      </div>

      <div
          v-for="option in indicator?.evaluation_parameter.options.option_answers.find(option => option.question_answer_id == indicatorConditionalMultiplePercentagesPonderatsTypeForm.conditionalOptionId).option_percentages"
          :key="option.option_id">
        <ion-label class="ion-text-wrap">{{ option.name }}</ion-label>
        <ion-input
            class="input-custom input-number"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.parameters.conditional_multiple_percentages_ponderats.percentage')"
            :disabled="isDisabledByFormula"
            v-model="indicatorConditionalMultiplePercentagesPonderatsTypeForm.options[option.option_id]"
            onwheel="return false;"
            type="number"
            placeholder="0%"
            min="0" max="100" step="0.01"/>
        <ValidationTextError :show="errorFields.includes('indicatorConditionalMultiplePercentagesPonderatsTypeForm.'+option.option_id)" />
        <br>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps, watch} from 'vue';
import {IonButton, IonIcon, IonInput, IonLabel, IonRadio, IonRadioGroup} from '@ionic/vue';

import {calculator} from 'ionicons/icons';
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorConditionalMultiplePercentagesPonderatsTypeForm: Object,
  openCalculator: Function,
  isDisabledByFormula: Boolean,
  disabledByFormulaMessage: String,
});

watch(
    () => props.indicatorConditionalMultiplePercentagesPonderatsTypeForm.conditionalOptionId,
    (newVal) => {
      if (newVal) {
        // Reiniciem les opcions seleccionades
        const selectedOption = props.indicator?.evaluation_parameter.options.option_answers.find(
            (option) => option.question_answer_id === newVal
        );

        if (selectedOption?.option_percentages) {
          props.indicatorConditionalMultiplePercentagesPonderatsTypeForm.options = {};
        }
      }
    }
);
</script>

<style scoped>
.white-box {
  background: white;
  border-radius: 10px;
  padding: 20px;
}
</style>

