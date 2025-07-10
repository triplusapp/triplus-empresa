<template>
  <div>

    <div v-show="indicatorPercentagesAllIngredientsPonderatsTypeForm.length===0" class="alert-danger">
      {{ $t('indicators.parameters.percentages_all_ingredients_ponderats.ingredients_missing') }}
      <br>
      <ion-button type="button" color="medium" size="small"
                  :router-link="Translation.i18nRoute({name: 'product', params: {productId: evaluableModelId}})">
        {{ $t('indicators.parameters.percentages_all_ingredients_ponderats.edit_product_btn') }}
      </ion-button>
    </div>

    <div v-show="indicatorPercentagesAllIngredientsPonderatsTypeForm.length>0">
      <ion-label>{{ $t('indicators.parameters.percentages_all_ingredients_ponderats.info') }}</ion-label>

      <div v-for="(row, index) in indicatorPercentagesAllIngredientsPonderatsTypeForm" :key="index"
           :class="{'subingredient' : row.ingredient.parent_id!==null}">
        <ion-label style="margin: 1rem 0 0.5rem 0;display: block;">
          <strong><u>{{ row.ingredient.name }}</u></strong> <small
            v-show="row.ingredient.parent_id!==null">
          {{ $t('indicators.parameters.percentages_all_ingredients_ponderats.subingredient') }}
        </small>
        </ion-label>
        <ion-radio-group v-model="indicatorPercentagesAllIngredientsPonderatsTypeForm[index].optionId">
          <div v-for="option in indicator?.evaluation_parameter.options" :key="option.id"
               class="item-radio" style="padding-left: 2rem;">
            <ion-radio name="radio_options" :value="option.id" slot="start"></ion-radio>
            <ion-label class="label-radio">{{ option.name }}</ion-label>
          </div>
        </ion-radio-group>
        <ValidationTextError :show="errorFields.includes('indicatorPercentagesAllIngredientsPonderatsTypeForm.'+index)" />
      </div>
    </div>

  </div>
</template>

<script setup>
import {defineProps} from 'vue';
import {IonButton, IonLabel, IonRadio, IonRadioGroup} from '@ionic/vue';
import Translation from "@/i18n/translation.js";
import ValidationTextError from "@/views/components/ValidationTextError.vue";


const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorPercentagesAllIngredientsPonderatsTypeForm: Object,
  evaluableModelId: String,
});
</script>

<style scoped>
.subingredient {
  padding-left: 2rem;
}
</style>
