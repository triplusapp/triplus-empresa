<template>
  <div>
    <div v-show="indicator?.evaluation_parameter.formula && indicator?.evaluation_parameter.formula!='escandall_costos'" style="margin: 10px 0;">
      <ion-button type="button" size="small" fill="outline" @click="openCalculator" shape="round">
        <ion-icon slot="start" :icon="calculator"></ion-icon>
        {{ $t('indicators.open_calculator')}}
      </ion-button>
    </div>

    <div style="margin-bottom: 0.5rem;"></div>

    <div class="white-box">
      <ion-label>
        {{ $t('indicators.parameters.radio.select_option')}}
      </ion-label>
      <ion-radio-group v-model="indicatorRadioTypeForm.optionId">
        <div v-for="option in indicator?.evaluation_parameter.options" :key="option.id" class="item-radio">
          <ion-radio name="radio_options" :value="option.id" slot="start"></ion-radio>
          <ion-label class="label-radio">{{ option.name }}</ion-label>
        </div>
      </ion-radio-group>
      <ValidationTextError :show="errorFields.includes('indicatorRadioTypeForm.optionId')" />
    </div>

    <div
        v-show="indicator?.evaluation_parameter.formula && indicator?.evaluation_parameter.formula=='escandall_costos' && indicator.evaluation_parameter.options.findIndex(option => option.id === indicatorRadioTypeForm.optionId) != 2"
         style="margin: 10px 0;">
      <ion-button type="button" size="small" fill="outline" @click="openCalculator" shape="round">
        <ion-icon slot="start" :icon="calculator"></ion-icon>
        {{ $t('indicators.formulas.escandall_costos.btn_open')}}
      </ion-button>
    </div>
  </div>
</template>

<script setup>
import {IonButton, IonIcon, IonLabel, IonRadio, IonRadioGroup} from '@ionic/vue';
import {calculator} from 'ionicons/icons';
import {defineProps} from 'vue';
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorRadioTypeForm: Object,
  openCalculator: Function
});

</script>
<style scoped>
.white-box {
  background: white;
  border-radius: 10px;
  padding: 20px;
}
</style>
