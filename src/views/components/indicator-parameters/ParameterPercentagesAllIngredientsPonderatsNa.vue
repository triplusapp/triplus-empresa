<template>
  <div>

    <div v-show="indicatorPercentagesAllIngredientsPonderatsNaTypeForm.length===0" class="alert-danger">
      {{ $t('indicators.parameters.percentages_all_ingredients_ponderats.ingredients_missing') }}
      <br>
      <ion-button type="button" color="medium" size="small"
                  :router-link="Translation.i18nRoute({name: 'product', params: {productId: evaluableModelId}})">
        {{ $t('indicators.parameters.percentages_all_ingredients_ponderats.edit_product_btn') }}
      </ion-button>
    </div>

    <div v-show="indicatorPercentagesAllIngredientsPonderatsNaTypeForm.length>0">
      <ion-label>{{ $t('indicators.parameters.percentages_all_ingredients_ponderats.info') }}</ion-label>

      <div v-for="(row, index) in indicatorPercentagesAllIngredientsPonderatsNaTypeForm" :key="index"
           :class="{
             'subingredient': row.ingredient.parent_id !== null,
             'has-subingredients': isIngredientWithSubingredients(row.ingredient),
             'last': isLastSubingredient(row, index)
           }"
           class="white-box">
        <ion-label style="margin-bottom:0.5rem;display: block;">
          <strong><u>{{ row.ingredient.name }}</u></strong> <small
            v-show="row.ingredient.parent_id!==null">
          {{ $t('indicators.parameters.percentages_all_ingredients_ponderats.subingredient') }}
        </small>
        </ion-label>
        <ion-radio-group
            v-model="indicatorPercentagesAllIngredientsPonderatsNaTypeForm[index].optionId"
            v-if="!isIngredientWithSubingredients(row.ingredient)">
          <div v-for="option in indicator?.evaluation_parameter.options" :key="option.id"
               class="item-radio" style="padding-left: 2rem;">
            <ion-radio name="radio_options" :value="option.id" slot="start"></ion-radio>
            <ion-label class="label-radio">{{ option.name }}</ion-label>
          </div>
        </ion-radio-group>

        <ValidationTextError
            :show="errorFields.includes('indicatorPercentagesAllIngredientsPonderatsNaTypeForm.'+row.ingredient.id)"
            />
      </div>
    </div>

  </div>
</template>

<script setup>
import {defineProps, ref} from 'vue';
import {IonButton, IonLabel, IonRadio, IonRadioGroup} from '@ionic/vue';
import Translation from "@/i18n/translation.js";
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const props = defineProps({
  indicator: Object,
  errorFields: Array,
  indicatorPercentagesAllIngredientsPonderatsNaTypeForm: Object,
  evaluableModelId: String,
});

const allIngredients = ref(Object.assign([], props.indicatorPercentagesAllIngredientsPonderatsNaTypeForm));

const isLastSubingredient = (row, index) => {
  const subingredients = allIngredients.value.filter(
      (item) => item.ingredient.parent_id === row.ingredient.parent_id
  );
  return subingredients[subingredients.length - 1].ingredient.id === row.ingredient.id;
};

const isIngredientWithSubingredients = (ingredient) => {
  if (ingredient.parent_id) {
    return false;
  }

  // Check if the current ingredient has subingredients
  const hasSubingredients = allIngredients.value
      .filter((row) => row.ingredient.parent_id === ingredient.id)
      .length > 0;

  return hasSubingredients;
};
</script>

<style scoped>
.white-box {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.white-box.has-subingredients {
  margin-bottom: 0;
  padding-bottom: 10px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.white-box.subingredient {
  padding-left: 2rem;
  border-radius: 0;
  padding-top: 10px;
  margin-bottom: 0;
}
.white-box.subingredient.last {
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  margin-bottom: 20px;
}
</style>
