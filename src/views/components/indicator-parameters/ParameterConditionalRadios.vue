<template>
  <div class="white-box">
    <ion-label>{{ indicator?.evaluation_parameter.options.question }}</ion-label>
    <ion-radio-group v-model="indicatorConditionalRadioTypeForm.conditionalOptionId">
      <div v-for="option in indicator?.evaluation_parameter.options.question_options" :key="option.id"
           class="item-radio">
        <ion-radio name="radio_options" :value="option.id" slot="start"></ion-radio>
        <ion-label class="label-radio">{{ option.name }}</ion-label>
      </div>
    </ion-radio-group>
    <ValidationTextError :show="errorFields.includes('indicatorConditionalRadioTypeForm.conditionalOptionId')" />

    <div v-if="indicatorConditionalRadioTypeForm.conditionalOptionId">
      <br>
      <ion-label>{{
          indicator?.evaluation_parameter.options.question_options.find(option => option.id === indicatorConditionalRadioTypeForm.conditionalOptionId).question_radio
        }}
      </ion-label>
      <ion-radio-group v-model="indicatorConditionalRadioTypeForm.optionId">
        <div
            v-for="option in indicator?.evaluation_parameter.options.question_options.find(option => option.id === indicatorConditionalRadioTypeForm.conditionalOptionId).radio_options"
            :key="option.id" class="item-radio">
          <ion-radio name="radio_options" :value="option.id" slot="start"></ion-radio>
          <ion-label class="label-radio">{{ option.name }}</ion-label>
        </div>
      </ion-radio-group>
      <ValidationTextError :show="errorFields.includes('indicatorConditionalRadioTypeForm.optionId')" />
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';
import {IonLabel, IonRadio, IonRadioGroup} from '@ionic/vue';
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorConditionalRadioTypeForm: Object,
});
</script>

<style scoped>
.white-box {
  background: white;
  border-radius: 10px;
  padding: 20px;
}
</style>
