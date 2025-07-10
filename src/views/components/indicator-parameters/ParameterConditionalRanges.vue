<template>
  <div class="white-box">
    <ion-label>{{ indicator?.evaluation_parameter.options.question }}</ion-label>
    <ion-radio-group v-model="indicatorConditionalRangeTypeForm.optionId">
      <div v-for="option in indicator?.evaluation_parameter.options.question_options" :key="option.id"
           class="item-radio">
        <ion-radio name="radio_options" :value="option.id" slot="start"></ion-radio>
        <ion-label class="label-radio">{{ option.name }}</ion-label>
      </div>
    </ion-radio-group>
    <ValidationTextError :show="errorFields.includes('indicatorConditionalRangeTypeForm.conditionalOptionId')" />

    <div v-if="indicatorConditionalRangeTypeForm.optionId">
      <br>
      <ion-label>{{
          indicator?.evaluation_parameter.options.question_options.find(option => option.id === indicatorConditionalRangeTypeForm.optionId).question_range
        }}
      </ion-label>
      <ion-input
          class="input-custom input-number"
          fill="solid"
          label-placement="floating"
          label="Resposta"
          v-model="indicatorConditionalRangeTypeForm.value"
          onwheel="return false;"
          type="number"
          min="0"
          placeholder="0"
          step=".01"/>
      <ValidationTextError :show="errorFields.includes('indicatorConditionalRangeTypeForm.value')" />
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';
import {IonInput, IonLabel, IonRadio, IonRadioGroup} from '@ionic/vue';
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorConditionalRangeTypeForm: Object,
});
</script>

<style scoped>
.white-box {
  background: white;
  border-radius: 10px;
  padding: 20px;
}
</style>
