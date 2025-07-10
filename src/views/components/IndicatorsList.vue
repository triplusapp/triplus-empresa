<template>


  <div style="display: flex; gap: 5px;align-items:center;margin-bottom: 1rem;justify-content:end;">
    <div style="text-align: center;margin-right: 15px;" v-if="evaluableModelType==='company'">
      <div>
        {{ companyInformationById.num_structural_indicators_evaluated ?? '-' }} /
        {{ companyInformationById.num_structural_indicators ?? '-' }}
      </div>
      <small>{{ $t('company.estructurals') }}</small>
    </div>

    <div style="text-align: center;margin-right: 15px;" v-if="evaluableModelType==='company'">
      <div>
        {{ companyInformationById.num_complementary_indicators_evaluated ?? '-' }} /
        {{ companyInformationById.num_complementary_indicators ?? '-' }}
      </div>
      <small>{{ $t('company.complementaris') }}</small>
    </div>

    <ion-button @click="expandAccordions()" size="small" fill="outline" shape="round">
      <ion-icon slot="start" :icon="chevronExpand"></ion-icon>
      {{ $t('indicators.expand_list') }}
    </ion-button>

    <ion-button @click="collapseAccordions()" size="small" fill="outline" shape="round">
      <ion-icon slot="start" :icon="chevronCollapse"></ion-icon>
      {{ $t('indicators.collapse_list') }}
    </ion-button>
  </div>

  <ion-accordion-group :multiple="true" ref="mainAccordionGroup">
    <ion-accordion
        :value="category.id"
        v-for="category in categories"
        :key="category.id"
    >
      <ion-item slot="header">
        <ion-label>
          <span style="display: flex; justify-content: space-between;">
            <span>{{ category.name }}</span>
            <span>
              {{ category.num_answered_indicators }} / {{ category.num_indicators }}
            </span>
          </span>
        </ion-label>
      </ion-item>

      <div slot="content" class="tree">
        <ion-accordion-group :multiple="true" ref="childsAccordionsGroups">
          <ion-accordion
              :value="subcategory.id"
              v-for="subcategory in category.subcategories"
              :key="subcategory.id"
          >
            <ion-item slot="header">
              <ion-label>
                <span style="display: flex; justify-content: space-between;">
                  <span>{{ subcategory.name }}</span>
                  <span>
                    {{ subcategory.num_answered_indicators }} / {{ subcategory.num_indicators }}
                  </span>
                </span>
              </ion-label>
            </ion-item>
            <div slot="content" class="tree">
              <ion-item
                  v-for="indicator in getIndicatorsCategory(category, subcategory)"
                  :key="indicator.id"
              >
                <div style="display: flex; align-items: center;width: 100%;">
                  <span>
                      <indicator-icon :icon="indicator.icon"/>
                  </span>

                  <router-link :to="Translation.i18nRoute({ name: 'indicator', params: {
	evaluableModelType: evaluableModelType,
    indicatorId: indicator.data.id,
    evaluableModelId: props.evaluableModelId,
}})"
                               v-if="indicator.can_be_viewed"
                               class="indicator">
                    {{ indicator.data.name }}
                    <span :class="'indicator-type ' + indicator?.data.type">{{ indicator?.data.type }}</span>
                  </router-link>
                  <span v-if="!indicator.can_be_viewed" class="disabled">
                    {{ indicator.data.name }}
                    <span :class="'indicator-type ' + indicator?.data.type">{{ indicator?.data.type }}</span>
                  </span>
                </div>
              </ion-item>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </div>
    </ion-accordion>
  </ion-accordion-group>
</template>

<script setup>
import {IonAccordion, IonAccordionGroup, IonButton, IonIcon, IonItem, IonLabel,} from '@ionic/vue';
import {onMounted, ref} from 'vue';
import Translation from "@/i18n/translation.js";
import SharedMethods from "@/shared/SharedMethods.js";
import {chevronCollapse, chevronExpand} from "ionicons/icons";
import IndicatorIcon from "@/views/components/IndicatorIcon.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";


const props = defineProps({
  indicators: {
    type: Array,
  },
  evaluableModelId: {},
  evaluableModelType: {
    type: String
  }
});

const companyInformationById = ref({
  num_structural_indicators: null,
  num_structural_indicators_evaluated: null,
  num_complementary_indicators: null,
  num_complementary_indicators_evaluated: null,
});


function appendIndicatorAnswersCountToCategoriesAndSubcategories(indicators) {
  for (let categoryIndex in categories.value) {
    for (let subcategoryIndex in categories.value[categoryIndex].subcategories) {
      let subcategoryId = categories.value[categoryIndex].subcategories[subcategoryIndex].id;
      let indicatorsSubcategory = indicators.filter(item => item.data.subcategory.id === subcategoryId);
      let numIndicators = indicatorsSubcategory.length;
      let numAnsweredIndicators = indicatorsSubcategory.filter(item => item.should_be_counted_as_evaluated).length;
      categories.value[categoryIndex].subcategories[subcategoryIndex].num_indicators = numIndicators;
      categories.value[categoryIndex].subcategories[subcategoryIndex].num_answered_indicators = numAnsweredIndicators;
    }

    let categoryId = categories.value[categoryIndex].id;
    let indicatorsCategory = indicators.filter(item => item.data.category.id === categoryId);
    let numIndicators = indicatorsCategory.length;
    let numAnsweredIndicators = indicatorsCategory.filter(item => item.should_be_counted_as_evaluated).length;
    categories.value[categoryIndex].num_indicators = numIndicators;
    categories.value[categoryIndex].num_answered_indicators = numAnsweredIndicators;
  }
}

const categories = ref(SharedMethods.createCategoriesSubcategoriesTree(props.indicators));
appendIndicatorAnswersCountToCategoriesAndSubcategories(props.indicators);

const getIndicatorsCategory = (category, subcategory) => {
  return props.indicators
      .filter(indicator => (
          indicator.data.category.id === category.id
          && indicator.data.subcategory.id === subcategory.id
      ))
      .sort(function (a, b) {
        return a.data.code - b.data.code;
      });
};

const fetchEvaluationsInformation = async () => {
  // Fill evaluated indicators number
  TraceabilityApiMethods.fetchCompanyIndicatorsInformation()
      .then(info => {
        companyInformationById.value.num_structural_indicators = info.num_structural_indicators;
        companyInformationById.value.num_structural_indicators_evaluated = info.num_structural_indicators_evaluated;
        companyInformationById.value.num_complementary_indicators = info.num_complementary_indicators;
        companyInformationById.value.num_complementary_indicators_evaluated = info.num_complementary_indicators_evaluated;
      });
}

const mainAccordionGroup = ref(null);
const childsAccordionsGroups = ref(null);
const expandAccordions = () => {
  // Toggle first level
  const nativeElem = mainAccordionGroup.value.$el;
  nativeElem.value = categories.value.map((category) => category.id.toString());

  // Toggle second level
  categories.value.forEach(function (category, i) {
    let childAccordionGroup = childsAccordionsGroups.value[i].$el;
    childAccordionGroup.value = category.subcategories.map((subcategory) => subcategory.id.toString());
  })
}

const collapseAccordions = () => {
  // Toggle first level
  const nativeElem = mainAccordionGroup.value.$el;
  nativeElem.value = [];

  // Toggle second level
  categories.value.forEach(function (category, i) {
    let childAccordionGroup = childsAccordionsGroups.value[i].$el;
    childAccordionGroup.value = [];
  })
}

onMounted(() => fetchEvaluationsInformation());

</script>


<style scoped>
.tree {
  background: #fff;
  padding-bottom: var(--ion-padding);
  padding-left: var(--ion-padding);
}

ion-item {
  --background: #fff;
}

ion-item a {
  flex-grow: 1;
  text-decoration: none;
}

ion-item a:hover {
  text-decoration: underline;
}

.indicator {
  color: var(--color);
  margin-left: 10px;
}

.indicator.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.indicator-type {
  margin-left: 10px;
  font-size: 11px;
}


</style>

