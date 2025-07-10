<template>
  <div>
    <div v-for="componentOptions in indicator?.evaluation_parameter.options"
         :key="componentOptions.component_id"
         :class="{'white-box': componentOptions.type==='radio'}" style="margin-top: 10px;">
      <ion-label><strong><u>{{ componentOptions.title }}</u></strong></ion-label>
      <div v-if="componentOptions.type==='radio'">
        <ion-label>
          {{ $t('indicators.parameters.multiple_simple_components.select_option') }}
        </ion-label>
        <ion-radio-group
            v-model="indicatorMultipleSimpleComponentsTypeForm.radioOptionsIds[componentOptions.component_id]"
        >
          <div v-for="option in componentOptions.options" :key="option.id" class="item-radio">
            <ion-radio name="radio_options" :value="option.id" slot="start"></ion-radio>
            <ion-label class="label-radio">{{ option.name }}</ion-label>
          </div>
        </ion-radio-group>
        <ValidationTextError :show="errorFields.includes('indicatorMultipleSimpleComponentsTypeForm.radioOptionsIds.'+componentOptions.component_id)" />
      </div>
      <div v-if="componentOptions.type==='range'">
        <ion-input
            class="input-custom input-number"
            fill="solid"
            label-placement="floating"
            :label="$t('indicators.parameters.multiple_simple_components.answer')"
            v-model="indicatorMultipleSimpleComponentsTypeForm.percentages[componentOptions.component_id]"
            onwheel="return false;"
            type="number"
            placeholder="0"
            :disabled="readOnlyFields.includes(componentOptions.component_id)"
            min="0"
            step=".01"/>
        <ValidationTextError :show="errorFields.includes('indicatorMultipleSimpleComponentsTypeForm.percentages.'+componentOptions.component_id)" />
      </div>
      <div v-if="componentOptions.type==='multiple_percentages_ponderats'">
        <p style="margin-top: 0;">{{ $t('indicators.parameters.multiple_simple_components.info') }}</p>
        <div v-show="indicator?.evaluation_parameter.formula" style="margin: 10px 0;">
          <ion-button type="button" size="small" fill="outline"
                      @click="openCalculator" shape="round">
            <ion-icon slot="start" :icon="calculator"></ion-icon>
            {{ $t('indicators.open_calculator') }}
          </ion-button>
          <div>
            <small v-show="isDisabledByFormula">{{ disabledByFormulaMessage }}</small>
          </div>
        </div>
        <div v-for="option in componentOptions.options" :key="option.id" style="margin-bottom: 15px;">
          <ion-label class="ion-text-wrap">{{ option.name }}</ion-label>
          <ion-input
              class="input-custom input-number"
              fill="solid"
              label-placement="floating"
              :label="$t('indicators.parameters.multiple_simple_components.percentage')"
              :disabled="isDisabledByFormula"
              v-model="indicatorMultipleSimpleComponentsTypeForm.multiplePercentages[option.id]"
              onwheel="return false;"
              type="number"
              placeholder="0%"
              min="0" max="100" step="0.01"/>
          <ValidationTextError :show="errorFields.includes('indicatorMultipleSimpleComponentsTypeForm.multiplePercentages.'+componentOptions.component_id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';
import {IonButton, IonIcon, IonInput, IonLabel, IonRadio, IonRadioGroup} from '@ionic/vue';

import {calculator} from 'ionicons/icons';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorMultipleSimpleComponentsTypeForm: Object,
  openCalculator: Function,
  isDisabledByFormula: Boolean,
  disabledByFormulaMessage: String,
});

const readOnlyFields = [];

// Exception: Model de petita pagesia o indústria alimentària
const options = props.indicator?.evaluation_parameter?.options?.value || props.indicator?.evaluation_parameter?.options;
const component = options.find(item =>
    item.title.toLowerCase() === 'total de treballadors' || item.title.toLowerCase() === 'total de trabajadores'
);
if (component) {
  readOnlyFields.push(component.component_id);
  TraceabilityApiMethods.fetchCompany()
      .then((companyData) => {
        props.indicatorMultipleSimpleComponentsTypeForm.percentages[component.component_id] = companyData.num_workers;
      });
}


</script>

<style scoped>
.white-box {
  background: white;
  border-radius: 10px;
  padding: 20px;
}
</style>

