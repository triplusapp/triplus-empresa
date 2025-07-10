<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t('indicators.page_title') }} {{ indicator?.evaluation_model_title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding" ref="ionContentElement">
      <div id="container" v-show="!pageIsLoading">
        <div style="display: flex;justify-content: space-between;">
          <ion-button type="button" size="default" fill="outline"
                      shape="round"
                      :disabled="!navigation.exitUrl"
                      @click="exitActionCheckingChanges">
            <ion-icon slot="start" :icon="close"></ion-icon>
            {{ $t('indicators.nav.exit_btn') }}
          </ion-button>
          <div>
            <ion-button type="button" size="default" fill="outline"
                        shape="round"
                        :disabled="!navigation.previousIndicatorUrl"
                        @click="navigateToPreviousIndicatorCheckingChanges">
              <ion-icon slot="start" :icon="arrowBack"></ion-icon>
              {{ $t('indicators.nav.previous_btn') }}
            </ion-button>
            <ion-button type="button" size="default" fill="outline"
                        shape="round"
                        :disabled="!navigation.nextIndicatorUrl"
                        @click="navigateToNextIndicatorCheckingChanges">
              <ion-icon slot="end" :icon="arrowForward"></ion-icon>
              {{ $t('indicators.nav.next_btn') }}
            </ion-button>
          </div>
        </div>

        <h5>{{ indicator?.data.category.name }} - {{ indicator?.data.subcategory.name }}</h5>

        <h3 class="indicator-title">
          <indicator-icon :icon="indicator.icon" v-if="indicator?.icon"/>
          <span>
          {{ indicator?.data.name }}
          </span>
        </h3>
        <div v-show="indicator?.data.description" v-html="indicator?.data.description"
             class="indicator-description"></div>

        <div style="display: flex;align-items: center;">
          <div :class="'indicator-type ' + indicator?.data.type" v-if="indicator?.data.type">
            {{ $t(`indicators.type.${indicator?.data.type}`) }}
          </div>
        </div>

        <div class="alert alert-info" v-show="!indicator?.can_be_evaluated" style="margin-top: 20px;">
          {{ indicator?.disabled_evaluation_reason }}
        </div>

        <div v-show="indicator?.evaluation_parameter.description" class="parameter-description">
          <div class="rich-text" v-html="indicator?.evaluation_parameter.description"></div>
        </div>
        <br>

        <form @submit.prevent="saveIndicatorAnswer" enctype="multipart/form-data" v-if="indicator?.can_be_evaluated"
              id="indicator-form">

          <div v-if="indicator?.candidate_answers_to_clone_from.length > 0">
            <div class="alert-info">
              {{ $t('indicators.duplicate_answer.info', {entity: evaluableModelTypeText}) }}
              <br>
              <br>

              <ion-radio-group v-model="commonForm.clone_from_other_answer">
                <div style="display: flex; align-items:center;gap: 10px; margin-bottom: 10px;"
                     v-for="answer in indicator?.candidate_answers_to_clone_from">
                  <ion-radio :value="answer.evaluable_id" label-placement="end">
                    {{ $t('indicators.duplicate_answer.copy_action', {entity: answer.title}) }}
                  </ion-radio>

                  <div class="link" @click="openCandidateToCloneAnswer(answer)">
                    {{ $t('indicators.duplicate_answer.view_action') }}
                  </div>

                </div>
                <div>
                  <ion-radio :value="null" label-placement="end">
                    {{ $t('indicators.duplicate_answer.dont_copy') }}
                  </ion-radio>
                </div>
              </ion-radio-group>
              <ion-button type="button" size="small" @click="cloneFromOtherAnswer">Aplicar</ion-button>
            </div>
          </div>

          <div v-if="!commonForm.does_not_apply">

            <div v-if="indicator?.evaluation_parameter.excluding_previous_binary_question">
              <ion-label>{{ indicator?.evaluation_parameter.excluding_previous_binary_question.question }}</ion-label>
              <ion-radio-group v-model="previous_binary_question_answer">
                <div>
                  <ion-radio :value="true" label-placement="end">Sí</ion-radio>
                </div>
                <div>
                  <ion-radio :value="false" label-placement="end">No</ion-radio>
                </div>
              </ion-radio-group>
              <ValidationTextError :show="errorFields.includes('previous_binary_question_answer')" />
              <br>
            </div>

            <div v-if="commonForm.previous_binary_question_satisfied">

              <ParameterRadio v-if="indicator?.evaluation_parameter.type==='radio'"
                              :errorFields="errorFields"
                              :indicator="indicator"
                              :indicatorRadioTypeForm="indicatorRadioTypeForm"
                              :openCalculator="openCalculator"/>

              <ParameterMultiplePercentagesPonderats
                  v-if="indicator?.evaluation_parameter.type==='multiple_percentages_ponderats'"
                  :indicator="indicator"
                  :errorFields="errorFields"
                  :indicatorMultiplePercentagesPonderatsTypeForm="indicatorMultiplePercentagesPonderatsTypeForm"
                  :openCalculator="openCalculator"
                  :isDisabledByFormula="isDisabledByFormula"
                  :disabledByFormulaMessage="disabledByFormulaMessage"
              />

              <ParameterConditionalMultiplePercentagesPonderats
                  v-if="indicator?.evaluation_parameter.type==='conditional_multiple_percentages_ponderats'"
                  :indicator="indicator"
                  :errorFields="errorFields"
                  :indicatorConditionalMultiplePercentagesPonderatsTypeForm="indicatorConditionalMultiplePercentagesPonderatsTypeForm"
                  :openCalculator="openCalculator"
                  :isDisabledByFormula="isDisabledByFormula"
                  :disabledByFormulaMessage="disabledByFormulaMessage"
              />

              <ParameterPercentagesIngredientsPonderats
                  v-if="indicator?.evaluation_parameter.type==='percentages_ingredients_ponderats'"
                  :indicator="indicator"
                  :errorFields="errorFields"
                  :indicatorPercentagesIngredientsPonderatsTypeForm="indicatorPercentagesIngredientsPonderatsTypeForm"
                  :evaluableModelId="evaluableModelId"
              />

              <ParameterPercentagesAllIngredientsPonderats
                  v-if="indicator?.evaluation_parameter.type==='percentages_all_ingredients_ponderats'"
                  :indicator="indicator"
                  :errorFields="errorFields"
                  :indicatorPercentagesAllIngredientsPonderatsTypeForm="indicatorPercentagesAllIngredientsPonderatsTypeForm"
                  :evaluableModelId="evaluableModelId"
              />
              <ParameterPercentagesAllIngredientsPonderatsNa
                  v-if="indicator?.evaluation_parameter.type==='percentages_all_ingredients_ponderats_na'"
                  :indicator="indicator"
                  :errorFields="errorFields"
                  :indicator-percentages-all-ingredients-ponderats-na-type-form="indicatorPercentagesAllIngredientsPonderatsNaTypeForm"
                  :evaluable-model-id="evaluableModelId"
              />

              <ParameterConditionalRanges
                  v-if="indicator?.evaluation_parameter.type==='conditional_ranges'"
                  :indicator="indicator"
                  :errorFields="errorFields"
                  :indicatorConditionalRangeTypeForm="indicatorConditionalRangeTypeForm"
              />

              <ParameterConditionalRadios
                  v-if="indicator?.evaluation_parameter.type==='conditional_radios'"
                  :indicator="indicator"
                  :errorFields="errorFields"
                  :indicatorConditionalRadioTypeForm="indicatorConditionalRadioTypeForm"
              />

              <ParameterRange
                  v-if="indicator?.evaluation_parameter.type==='range'"
                  :indicator="indicator"
                  :errorFields="errorFields"
                  :indicatorRangeTypeForm="indicatorRangeTypeForm"
                  :openCalculator="openCalculator"
                  :isDisabledByFormula="isDisabledByFormula"
                  :disabledByFormulaMessage="disabledByFormulaMessage"
              />

              <ParameterClimaticZone
                  v-if="indicator?.evaluation_parameter.type==='climatic_zone'"
                  :indicator="indicator"
                  :errorFields="errorFields"
                  :indicatorClimaticZoneTypeForm="indicatorClimaticZoneTypeForm"
                  :openCalculator="openCalculator"
                  :isDisabledByFormula="isDisabledByFormula"
                  :disabledByFormulaMessage="disabledByFormulaMessage"
              />

              <ParameterRanking
                  v-if="indicator?.evaluation_parameter.type==='ranking'"
                  :indicatorRankingTypeForm="indicatorRankingTypeForm"
              />

              <ParameterWorkersSurvey
                  v-if="indicator?.evaluation_parameter.type==='workers_survey'"
                  :copyLinkWorkerSurvey="copyLinkWorkerSurvey"
              />

              <ParameterMultipleSimpleComponents
                  v-if="indicator?.evaluation_parameter.type==='multiple_simple_components' || indicator?.evaluation_parameter.type==='extra_component_additional_score'"
                  :indicator="indicator"
                  :indicatorMultipleSimpleComponentsTypeForm="indicatorMultipleSimpleComponentsTypeForm"
                  :openCalculator="openCalculator"
                  :isDisabledByFormula="isDisabledByFormula"
                  :disabledByFormulaMessage="disabledByFormulaMessage"
                  :errorFields="errorFields"
              />

              <div v-if="indicator?.data.evaluation_info_helper_text">
                <br>
                <div class="rich-text" v-html="indicator?.data.evaluation_info_helper_text"></div>
              </div>

              <div v-if="indicator?.data.required_justification">
                <ion-textarea
                    :auto-grow="true"
                    class="input-custom"
                    fill="solid"
                    label-placement="floating"
                    v-model="commonForm.answer"
                    :label="$t('indicators.justify_label')"
                    rows="4"
                    :placeholder="$t('indicators.justify_placeholder')"/>
                <ValidationTextError :show="errorFields.includes('indicator_justification')" />
              </div>

              <VerificationSystemInfo
                  v-show="indicator?.data.evaluation_verification_system_info"
                  :info="indicator?.data.evaluation_verification_system_info"
              />

              <div v-if="indicator?.data.documents_allowed">
                <br>
                <ion-label>Documents</ion-label>
                <div v-for="(selectedFile, index) in commonForm.files" :key="selectedFile.rowId">
                  <div class="file-item" v-show="selectedFile.fileId">
                    <div @click="removeFile(selectedFile.rowId, selectedFile.name)" style="display: flex;">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M7.99999 7.28666L11.8127 3.47333C11.91 3.376 12.0387 3.32733 12.1667 3.32733C12.436 3.32733 12.6667 3.54333 12.6667 3.82666C12.6667 3.95533 12.618 4.08333 12.5207 4.18133L8.70733 7.994L12.52 11.8067C12.618 11.9047 12.6667 12.0327 12.6667 12.1607C12.6667 12.4453 12.434 12.6607 12.1667 12.6607C12.0387 12.6607 11.91 12.612 11.8127 12.5147L7.99999 8.702L4.18733 12.5147C4.08999 12.612 3.96133 12.6607 3.83333 12.6607C3.56599 12.6607 3.33333 12.4453 3.33333 12.1607C3.33333 12.0327 3.38199 11.9047 3.47999 11.8067L7.29266 7.994L3.47933 4.18133C3.38199 4.08333 3.33333 3.95533 3.33333 3.82666C3.33333 3.54333 3.56399 3.32733 3.83333 3.32733C3.96133 3.32733 4.08999 3.376 4.18733 3.47333L7.99999 7.28666Z"
                              fill="black"/>
                      </svg>
                    </div>
                    <div class="file-name">
                      <div class="file-download" @click="downloadFile(selectedFile)">{{ selectedFile.name }}</div>
                    </div>
                  </div>
                  <div class="file-item" v-show="!selectedFile.fileId">
                    <ion-spinner color="primary" name="circular"></ion-spinner>
                    <div class="file-name">
                      {{ selectedFile.name }}
                    </div>
                  </div>
                </div>

                <br>

                <ion-input v-show="enabledFileUpload && !uploadingFiles" type="file" multiple="true"
                           style="margin-top: 10px;" ref="inputFiles"
                           @change="onFilesChanged($event)"/>

                <ion-button type="button" fill="outline" v-show="!enabledFileUpload"
                            shape="round"
                            @click="enabledFileUpload = true">Afegir document
                </ion-button>
              </div>

              <br>
              <ion-textarea
                  class="input-custom"
                  fill="solid"
                  label-placement="floating"
                  :auto-grow="true"
                  v-model="commonForm.comments"
                  :label="$t('indicators.observacions_label')"
                  :placeholder="$t('indicators.justify_placeholder')"
                  rows="4"/>
            </div>
          </div>

          <br>
          <ion-checkbox labelPlacement="end" v-model="commonForm.does_not_apply" @ionChange="doesNotApplyChanged"
                        v-show="indicator?.evaluation_parameter.type!=='workers_survey'">
            {{ $t('indicators.does_not_apply_confirmation.checkbox_btn') }}
          </ion-checkbox>

          <br>
          <ion-checkbox labelPlacement="end" v-show="indicator?.can_be_dismissed" v-model="dismiss_indicator_answer"
                        @ionChange="dontWantToAnswerChanged">
            {{ $t('indicators.dont_want_to_answer_confirmation.checkbox_btn') }}
          </ion-checkbox>

          <div v-if="commonForm.does_not_apply">
            <br>
            <ion-textarea
                class="input-custom"
                fill="solid"
                label-placement="floating"
                :auto-grow="true"
                required
                v-model="commonForm.comments"
                :label="$t('indicators.does_not_apply_confirmation.comments_label')"
                :placeholder="$t('indicators.does_not_apply_confirmation.comments_placeholder')"/>
          </div>

          <br>
          <br>
          <div style="display: flex;justify-content: space-between;">
            <ion-button type="submit" size="default" :disabled="uploadingFiles"
                        shape="round"
                        v-show="indicator?.evaluation_parameter.type!=='workers_survey'">
              {{ $t('global.save_btn') }}
            </ion-button>

            <ion-button type="button" size="small" fill="clear" color="danger"
                        v-show="canBeDeleted" @click="askDeleteConfirmation">
              <ion-icon slot="start" :icon="trashBin"></ion-icon>
              {{ $t('indicators.delete_btn') }}
            </ion-button>
          </div>
        </form>

        <ion-checkbox labelPlacement="end"
                      v-show="!indicator?.can_be_evaluated && indicator?.can_be_dismissed && dismiss_indicator_answer"
                      v-model="dismiss_indicator_answer" @ionChange="toggleDismissIndicatorAnswer(false)">
          {{ $t('indicators.dont_want_to_answer_confirmation.checkbox_btn') }}
        </ion-checkbox>

      </div>
    </ion-content>
  </main-layout>
</template>

<script setup>
import {Clipboard} from '@capacitor/clipboard';
import {useUserStore} from "@/store/user.store.js";
import {computed, onMounted, ref, watch} from 'vue';
import ModalDoesNotApplyConfirmation from "@/views/components/ModalDoesNotApplyConfirmation.vue";
import ModalReplicateAnswer from "@/views/components/ModalReplicateAnswer.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {useRoute, useRouter} from 'vue-router';
import {
  IonAlert,
  alertController,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonMenuButton,
  IonRadio,
  IonRadioGroup,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  modalController
} from '@ionic/vue';

import {arrowBack, arrowForward, close, informationCircleOutline, trashBin} from 'ionicons/icons';

import SharedMethods from "@/shared/SharedMethods.js";
import IndicatorNavigation from "@/indicators/IndicatorNavigation.js";
import IndicatorFormEvaluationValidate from "@/indicators/IndicatorFormEvaluationValidate.js";
import IndicatorFormEvaluation from "@/indicators/IndicatorFormEvaluation.js";
import ModalGrauEndeutamentBancariCalculator
  from "@/views/components/formulas/ModalGrauEndeutamentBancariCalculator.vue";
import ModalBretxaGenereCalculator from "@/views/components/formulas/ModalBretxaGenereCalculator.vue";
import ModalRatioSalarialCalculator from "@/views/components/formulas/ModalRatioSalarialCalculator.vue";
import ModalDesviacioParitatLlocsResponsabilitatCalculator
  from "@/views/components/formulas/ModalDesviacioParitatLlocsResponsabilitatCalculator.vue";
import ModalSalariDigneCalculator from "@/views/components/formulas/ModalSalariDigneCalculator.vue";
import ModalCentreTreballMultiplesPercentages
  from "@/views/components/formulas/ModalCentreTreballMultiplesPercentages.vue";
import ModalFacturacioPonderadaCalculator from "@/views/components/formulas/ModalFacturacioPonderadaCalculator.vue";
import ModalHeterogeneitatEspacialExplotacioCalculator
  from "@/views/components/formulas/ModalHeterogeneitatEspacialExplotacioCalculator.vue";
import Ingredients from "@/products/Ingredients.js";
import ModalDespesaEnergeticaCalculator from "@/views/components/formulas/ModalDespesaEnergeticaCalculator.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import IndicatorIcon from "@/views/components/IndicatorIcon.vue";
import ParameterRadio from "@/views/components/indicator-parameters/ParameterRadio.vue";
import ParameterRange from "@/views/components/indicator-parameters/ParameterRange.vue";
import ParameterWorkersSurvey from "@/views/components/indicator-parameters/ParameterWorkersSurvey.vue";
import ParameterMultiplePercentagesPonderats
  from "@/views/components/indicator-parameters/ParameterMultiplePercentagesPonderats.vue";
import ParameterMultipleSimpleComponents
  from "@/views/components/indicator-parameters/ParameterMultipleSimpleComponents.vue";
import ParameterConditionalRanges from "@/views/components/indicator-parameters/ParameterConditionalRanges.vue";
import ParameterConditionalRadios from "@/views/components/indicator-parameters/ParameterConditionalRadios.vue";
import ParameterConditionalMultiplePercentagesPonderats
  from "@/views/components/indicator-parameters/ParameterConditionalMultiplePercentagesPonderats.vue";
import ParameterRanking from "@/views/components/indicator-parameters/ParameterRanking.vue";
import ParameterClimaticZone from "@/views/components/indicator-parameters/ParameterClimaticZone.vue";
import ParameterPercentagesAllIngredientsPonderats
  from "@/views/components/indicator-parameters/ParameterPercentagesAllIngredientsPonderats.vue";
import ParameterPercentagesIngredientsPonderats
  from "@/views/components/indicator-parameters/ParameterPercentagesIngredientsPonderats.vue";
import VerificationSystemInfo from "@/views/components/VerificationSystemInfo.vue";
import ModalDontWantToAnswerConfirmation from "@/views/components/ModalDontWantToAnswerConfirmation.vue";
import Translation from "@/i18n/translation.js";
import {useI18n} from "vue-i18n";
import ParameterPercentagesAllIngredientsPonderatsNa
  from "@/views/components/indicator-parameters/ParameterPercentagesAllIngredientsPonderatsNa.vue";
import ModalEscandallCostosCalculator from "@/views/components/formulas/ModalEscandallCostosCalculator.vue";
import ModalAprofitamentAiguesPluvialsCalculator
  from "@/views/components/formulas/ModalAprofitamentAiguesPluvialsCalculator.vue";
import ModalPetitaPagesia from "@/views/components/formulas/ModalPetitaPagesia.vue";
import ValidationTextError from "@/views/components/ValidationTextError.vue";
import RequiredFieldError from "@/indicators/RequiredFieldError.js";

const {t} = useI18n();

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const {evaluableModelType, indicatorId, evaluableModelId} = route.params;
const indicatorIdRef = ref(indicatorId);

const errorFields = ref([]);
const indicator = ref(null);
const navigation = ref({
  exitUrl: null,
  previousIndicatorUrl: null,
  nextIndicatorUrl: null,
});
const ionContentElement = ref(null);
const pageIsLoading = ref(true);

const evaluableModelTypeText = computed(() => {
  const titles = {
    'product': 'producte',
    'sector': 'sector',
    'company': 'empresa',
  }
  return titles[evaluableModelType];
})

// Files
const enabledFileUpload = ref(false);
const uploadingFiles = ref(false);
const inputFiles = ref(null);
const addFile = () => {
  let rowId = Date.now();
  commonForm.value.files.push({
    rowId: rowId,
    fileId: null,
    file: null,
    url: null,
    name: '',
  });
  return rowId;
};

const downloadFile = (file) => {
  TraceabilityApiMethods.fetchEvaluationFile(file.url)
      .then((blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
      })
      .catch(message => SharedMethods.showErrorToast('Error file downloading'));
};

const onFilesChanged = async ($event) => {
  const target = $event.target;
  uploadingFiles.value = false;
  if (!target || !target.files) {
    return;
  }
  uploadingFiles.value = true;

  for (let i = 0; i < target.files.length; i++) {
    let file = target.files[i];
    let rowId = addFile();
    let targetIndex = commonForm.value.files.findIndex(element => element.rowId === rowId);
    commonForm.value.files[targetIndex].file = file;
    commonForm.value.files[targetIndex].name = file.name;

    let formData = new FormData();
    formData.append('file', file);

    await TraceabilityApiMethods.uploadEvaluationFile(formData)
        .then(function (data) {
          commonForm.value.files[targetIndex].fileId = data.id;
          commonForm.value.files[targetIndex].url = data.url;
          commonForm.value.files[targetIndex].file = null;
        });
  }
  enabledFileUpload.value = false;
  uploadingFiles.value = false;
  inputFiles.value.$el.value = null;
}

const removeFile = (targetRowId, fileName) => {
  if (confirm("Segur que vols eliminar l'arxiu: " + fileName)) {
    const targetIndex = commonForm.value.files.findIndex(element => element.rowId === targetRowId);
    commonForm.value.files.splice(targetIndex, 1);
  }
};

const openCandidateToCloneAnswer = async (answer) => {
  const routeData = Translation.i18nRoute({
    name: 'indicator',
    params: {
      evaluableModelType: evaluableModelType,
      indicatorId: indicatorIdRef.value,
      evaluableModelId: answer.evaluable_id,
    }
  });
  const resolvedRoute = router.resolve(routeData);
  window.open(resolvedRoute.href);
}

// Does not apply
const openModalDoesNotApplyConfirmation = async () => {
  const modal = await modalController.create({
    component: ModalDoesNotApplyConfirmation,
  });
  await modal.present();

  const response = await modal.onWillDismiss();
  commonForm.value.does_not_apply = (response.role === 'confirm');
};
const doesNotApplyChanged = () => {
  if (commonForm.value.does_not_apply) {
    openModalDoesNotApplyConfirmation();
  }
};

// Don't want to answer
const openModalDontWantToAnswerConfirmation = async () => {
  const modal = await modalController.create({
    component: ModalDontWantToAnswerConfirmation,
  });
  await modal.present();

  const response = await modal.onWillDismiss();
  dismiss_indicator_answer.value = (response.role === 'confirm');
  if (dismiss_indicator_answer.value === true) {
    toggleDismissIndicatorAnswer(true);
  }
};

const dontWantToAnswerChanged = () => {
  if (dismiss_indicator_answer.value) {
    openModalDontWantToAnswerConfirmation();
  }
};

// Clone from other answer
const cloneFromOtherAnswer = async () => {
  const tempIndicatorData = indicator.value;
  if (commonForm.value.clone_from_other_answer === null) {
    resetForm();
    fetchIndicator();
    return;
  }
  const evaluableModelIdToCloneFrom = commonForm.value.clone_from_other_answer;
  pageIsLoading.value = true;
  const loadingPage = await SharedMethods.showLoadingPage();
  TraceabilityApiMethods
      .fetchIndicatorWithAnwser(indicatorIdRef.value, evaluableModelIdToCloneFrom)
      .then((data) => {
        resetForm();
        indicator.value = tempIndicatorData;
        fillAnswer(data);
        commonForm.value.files = [];
        commonForm.value.clone_from_other_answer = evaluableModelIdToCloneFrom;
        saveFormToDetectUserChanges();
      })
      .finally(() => {
        pageIsLoading.value = false;
        loadingPage.dismiss();
      });
};

// Modal calculator
const openCalculator = async () => {
  errorFields.value = [];
  const componentsMap = {
    grau_endeutament_bancari: ModalGrauEndeutamentBancariCalculator,
    despesa_energetica: ModalDespesaEnergeticaCalculator,
    escandall_costos: ModalEscandallCostosCalculator,
    bretxa_genere_salarial: ModalBretxaGenereCalculator,
    ratio_salarial: ModalRatioSalarialCalculator,
    facturacio_ponderada: ModalFacturacioPonderadaCalculator,
    aprofitament_aigues_pluvials: ModalAprofitamentAiguesPluvialsCalculator,
    desviacio_paritat_llocs_responsabilitat: ModalDesviacioParitatLlocsResponsabilitatCalculator,
    salari_digne_per_comarques: ModalSalariDigneCalculator,
    centres_treball_multiples_percentatges: ModalCentreTreballMultiplesPercentages,
    heterogeneitat_espacial_explotacio: ModalHeterogeneitatEspacialExplotacioCalculator,
    petita_pagesia: ModalPetitaPagesia
  };

  const dynamicComponent = componentsMap[indicator.value.evaluation_parameter.formula];
  let componentProps = {data_store: indicator.value.evaluation_answer?.formula ?? null};

  if (indicator.value.evaluation_parameter.formula === 'escandall_costos') {
    let index = indicator.value.evaluation_parameter.options.findIndex(option => option.id === indicatorRadioTypeForm.value.optionId);
    if (index === -1 || index === 2) {
      return;
    }
    componentProps.escandall_complet = (index === 0);
  }

  if (['centres_treball_multiples_percentatges', 'petita_pagesia'].includes(indicator.value.evaluation_parameter.formula)) {
    if (indicator.value.evaluation_parameter.type === 'multiple_percentages_ponderats') {
      componentProps.indicatorOptions = indicator.value.evaluation_parameter.options.map(option => {
        option.option_id = option.id;
        return option;
      });
    }
    if (indicator.value.evaluation_parameter.type === 'conditional_multiple_percentages_ponderats') {
      componentProps.indicatorOptions = indicator.value
          .evaluation_parameter
          .options
          .option_answers
          .find(option => option.question_answer_id == indicatorConditionalMultiplePercentagesPonderatsTypeForm.value.conditionalOptionId)
          .option_percentages
    }
    if (indicator.value.evaluation_parameter.type === 'multiple_simple_components') {
      let selectedQuestionAnswerOption = indicator.value.evaluation_parameter.options.filter(option => {
        return option.type === 'multiple_percentages_ponderats';
      })[0];

      componentProps.indicatorOptions = selectedQuestionAnswerOption.options.map((row) => {
        row.option_id = row.id;
        return row;
      });
    }
  }

  const modal = await modalController.create({
    component: dynamicComponent,
    componentProps: componentProps
  });
  await modal.present();

  const response = await modal.onWillDismiss();
  if (response.role === 'update') {

    if (indicator.value.evaluation_parameter.type === 'range') {
      indicatorRangeTypeForm.value.value = response.data.result;
    } else if (indicator.value.evaluation_parameter.type === 'climatic_zone') {
      indicatorClimaticZoneTypeForm.value.energy_consumption = response.data.result;
    } else if (indicator.value.evaluation_parameter.type === 'multiple_percentages_ponderats') {
      for (let i in response.data.result) {
        let row = response.data.result[i];
        indicatorMultiplePercentagesPonderatsTypeForm.value.options[row.option_id] = row.percentage;
      }
    } else if (indicator.value.evaluation_parameter.type === 'conditional_multiple_percentages_ponderats') {
      for (let i in response.data.result) {
        let row = response.data.result[i];
        indicatorConditionalMultiplePercentagesPonderatsTypeForm.value.options[row.option_id] = row.percentage;
      }
    } else if (
        indicator.value.evaluation_parameter.type === 'multiple_simple_components'
        && ['centres_treball_multiples_percentatges', 'petita_pagesia'].includes(indicator.value.evaluation_parameter.formula)
    ) {
      for (let i in response.data.result) {
        let row = response.data.result[i];
        indicatorMultipleSimpleComponentsTypeForm.value.multiplePercentages[row.option_id] = row.percentage;
      }
    }

    // Save calculator formula
    commonForm.value.formula = response.data.data_store;
    if (indicator.value.evaluation_answer) {
      indicator.value.evaluation_answer.formula = response.data.data_store;
    } else {
      indicator.value.evaluation_answer = {formula: response.data.data_store};
    }
  }
};

// Candidates to replicate answer
const openModalCandidatesToReplicateAnswers = async (candidate_answers_to_replicate_to) => {
  const modal = await modalController.create({
    component: ModalReplicateAnswer,
    componentProps: {candidate_answers_to_replicate_to: candidate_answers_to_replicate_to}
  });
  await modal.present();

  const response = await modal.onWillDismiss();
  if (response.role === 'update' && response.data.answers_to_replicate_to.length > 0) {
    const formData = {
      answers_to_replicate_to: response.data.answers_to_replicate_to
    };
    TraceabilityApiMethods.replicateIndicatorAnswer(indicatorIdRef.value, evaluableModelId, formData)
        .then(() => SharedMethods.showSuccessfulToast(t('indicators.replicate_answer.updated')))
        .catch((errorMessage) => {
          const errorToastMessage = errorMessage === 'platform_closed'
              ? t('global.alert_messages.platform_closed')
              : errorMessage;

          SharedMethods.showErrorToast(errorToastMessage);
        });
  }
};

const askDeleteConfirmation = async () => {
  const alertButtons = [
    {
      text: t('indicators.delete_confirmation.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('indicators.delete_confirmation.confirm_btn'),
      role: 'confirm',
      handler: () => deleteIndicatorAnswer(),
    },
  ];
  const alert = await alertController.create({
    header: t('indicators.delete_confirmation.header'),
    message: t('indicators.delete_confirmation.message'),
    buttons: alertButtons,
  });
  await alert.present();
}

// Navigation
async function showAlertToConfirmExitWithoutSavePendingExit(confirmCallback) {
  const alertButtons = [
    {
      text: t('indicators.exit_confirmation.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('indicators.exit_confirmation.confirm_btn'),
      role: 'confirm',
      handler: () => confirmCallback(),
    },
  ];
  const alert = await alertController.create({
    header: t('indicators.exit_confirmation.header'),
    message: t('indicators.exit_confirmation.message'),
    buttons: alertButtons,
  });
  await alert.present();
}

const exitActionCheckingChanges = () => {
  if (!userHasMadeChanges()) {
    exitAction();
    return;
  }
  showAlertToConfirmExitWithoutSavePendingExit(() => {
    exitAction()
  });
};

const navigateToPreviousIndicatorCheckingChanges = () => {
  if (!userHasMadeChanges()) {
    navigateToPreviousIndicator();
    return;
  }
  showAlertToConfirmExitWithoutSavePendingExit(() => {
    navigateToPreviousIndicator()
  });
};
const navigateToNextIndicatorCheckingChanges = () => {
  if (!userHasMadeChanges()) {
    navigateToNextIndicator();
    return;
  }

  showAlertToConfirmExitWithoutSavePendingExit(() => {
    navigateToNextIndicator()
  });
};

function exitAction() {
  router.push(navigation.value.exitUrl);
}

function navigateToPreviousIndicator() {
  router.push(navigation.value.previousIndicatorUrl);
}

function navigateToNextIndicator() {
  router.push(navigation.value.nextIndicatorUrl);
}

// Survey
const copyLinkWorkerSurvey = async () => {
  const url = indicator.value.evaluation_parameter.options.route
      .replace('%company%', userStore.company.id)
      .replace('%indicator%', indicatorIdRef.value)
      .replace('%evaluableModelId%', evaluableModelId);

  await Clipboard
      .write({string: url})
      .then(() => SharedMethods.showSuccessfulToast(t('indicators.survey_link_copied')));
}

// Forms
const commonForm = ref({
  answer: null,
  comments: null,
  does_not_apply: false,
  clone_from_other_answer: null,
  previous_binary_question_satisfied: null,
  files: [],
  formula: null
});

// Handle dismiss
const dismiss_indicator_answer = ref(false);

// Handle evaluation previous condition
const previous_binary_question_answer = ref(null);
watch(previous_binary_question_answer, (newValue) => {
  commonForm.value.previous_binary_question_satisfied = (newValue == indicator.value.evaluation_parameter.excluding_previous_binary_question.valid_answer);
})

const indicatorRadioTypeForm = ref({
  optionId: null,
});

const indicatorRangeTypeForm = ref({
  value: null,
});

const indicatorClimaticZoneTypeForm = ref({
  energy_consumption: null,
  edificacio_id: null,
});

const indicatorConditionalRangeTypeForm = ref({
  optionId: null,
  value: null,
});

const indicatorConditionalRadioTypeForm = ref({
  conditionalOptionId: null,
  optionId: null,
});

const indicatorRankingTypeForm = ref({
  value: null,
});

const indicatorMultiplePercentagesPonderatsTypeForm = ref({
  options: {}
});

const indicatorConditionalMultiplePercentagesPonderatsTypeForm = ref({
  conditionalOptionId: null,
  options: {}
});

const indicatorPercentagesIngredientsPonderatsTypeForm = ref([]);
const indicatorPercentagesAllIngredientsPonderatsTypeForm = ref([]);
const indicatorPercentagesAllIngredientsPonderatsNaTypeForm = ref([]);

const indicatorMultipleSimpleComponentsTypeForm = ref({
  radioOptionsIds: {},
  percentages: {},
  conditionalOptionId: {},
  multiplePercentages: {}
});

let oldFormData = {};

const canBeDeleted = ref(false);
const isDisabledByFormula = ref(false);
const disabledByFormulaMessage = t('indicators.alert_messages.calculator_required');

function saveFormToDetectUserChanges() {
  oldFormData = createFormData();
}

function userHasMadeChanges() {
  let currentFormData = createFormData();
  return JSON.stringify(oldFormData) !== JSON.stringify(currentFormData);
}

function createFormData() {
  let indicatorTypeAnswer = IndicatorFormEvaluation.parseIndicatorTypeAnswerValue(
      indicator,
      indicator.value.evaluation_parameter.type,
      indicatorRadioTypeForm,
      indicatorRangeTypeForm,
      indicatorRankingTypeForm,
      indicatorClimaticZoneTypeForm,
      indicatorMultipleSimpleComponentsTypeForm,
      indicatorMultiplePercentagesPonderatsTypeForm,
      indicatorConditionalRangeTypeForm,
      indicatorConditionalRadioTypeForm,
      indicatorPercentagesIngredientsPonderatsTypeForm,
      indicatorConditionalMultiplePercentagesPonderatsTypeForm,
      indicatorPercentagesAllIngredientsPonderatsTypeForm,
      indicatorPercentagesAllIngredientsPonderatsNaTypeForm
  );

  return IndicatorFormEvaluation.createFormData(
      indicator,
      commonForm,
      indicatorTypeAnswer.value
  );
}

function fillAnswer(indicatorValue) {
  if (!indicatorValue.evaluation_parameter.excluding_previous_binary_question) {
    commonForm.value.previous_binary_question_satisfied = true;
  } else if (indicatorValue.evaluation_answer) {

    const haMarcatLaRespostaQuePermetRespondreFormulari = indicatorValue.evaluation_answer.previous_binary_question_satisfied;
    const respostaQuePermetRespondreFormulari = indicatorValue.evaluation_parameter.excluding_previous_binary_question.valid_answer;

    previous_binary_question_answer.value = (haMarcatLaRespostaQuePermetRespondreFormulari) ? respostaQuePermetRespondreFormulari : !respostaQuePermetRespondreFormulari;
  }

  if (!indicatorValue.evaluation_answer) {
    return;
  }
  canBeDeleted.value = true;
  commonForm.value.answer = indicatorValue.evaluation_answer.answer;
  commonForm.value.comments = indicatorValue.evaluation_answer.comment;
  commonForm.value.does_not_apply = indicatorValue.evaluation_answer.does_not_apply;
  commonForm.value.files = indicatorValue.evaluation_answer.files.map(function (file) {
    return {
      rowId: file.id,
      fileId: file.id,
      file: null,
      url: file.url,
      name: file.filename,
    };
  });

  if (indicatorValue.evaluation_parameter.type === 'radio') {
    indicatorRadioTypeForm.value.optionId = indicatorValue.evaluation_answer.value;
  }
  if (indicatorValue.evaluation_parameter.type === 'range') {
    indicatorRangeTypeForm.value.value = indicatorValue.evaluation_answer.value;
  }
  if (indicatorValue.evaluation_parameter.type === 'ranking') {
    indicatorRankingTypeForm.value.value = indicatorValue.evaluation_answer.value;
  }
  if (indicatorValue.evaluation_parameter.type === 'multiple_percentages_ponderats' && indicatorValue.evaluation_answer.value) {
    for (let key in indicatorValue.evaluation_answer.value) {
      let {option_id, percentage} = indicatorValue.evaluation_answer.value[key];
      indicatorMultiplePercentagesPonderatsTypeForm.value.options[option_id] = percentage;
    }
  }
  if (indicatorValue.evaluation_parameter.type === 'conditional_multiple_percentages_ponderats' && indicatorValue.evaluation_answer.value) {
    indicatorConditionalMultiplePercentagesPonderatsTypeForm.value.conditionalOptionId = indicatorValue.evaluation_answer.value.conditional_option_id;
    for (let key in indicatorValue.evaluation_answer.value.percentages) {
      let {option_id, percentage} = indicatorValue.evaluation_answer.value.percentages[key];
      indicatorConditionalMultiplePercentagesPonderatsTypeForm.value.options[option_id] = percentage;
    }
  }
  if (indicatorValue.evaluation_parameter.type === 'multiple_simple_components' || indicatorValue.evaluation_parameter.type === 'extra_component_additional_score') {
    for (let key in indicatorValue.evaluation_answer.value) {
      let componentAnswer = indicatorValue.evaluation_answer.value[key];
      // Conditional Multiple Percentages
      if (componentAnswer.hasOwnProperty('option_id') && componentAnswer.hasOwnProperty('percentage')) {
        indicatorMultipleSimpleComponentsTypeForm.value.multiplePercentages[componentAnswer.option_id] = componentAnswer.percentage;
      }
      if (componentAnswer.hasOwnProperty('conditional_option_id')) {
        indicatorMultipleSimpleComponentsTypeForm.value.conditionalOptionId[componentAnswer.component_id] = componentAnswer.conditional_option_id;
      }
      // End conditional multiple percentages

      // Range
      if (componentAnswer.hasOwnProperty('percentage') && !componentAnswer.hasOwnProperty('option_id')) {
        indicatorMultipleSimpleComponentsTypeForm.value.percentages[componentAnswer.component_id] = componentAnswer.percentage;
      }
      // Radio
      if (componentAnswer.hasOwnProperty('option_id') && !componentAnswer.hasOwnProperty('percentage')) {
        indicatorMultipleSimpleComponentsTypeForm.value.radioOptionsIds[componentAnswer.component_id] = componentAnswer.option_id;
      }
    }
  }
  if (indicatorValue.evaluation_parameter.type === 'conditional_ranges' && indicatorValue.evaluation_answer.value) {
    indicatorConditionalRangeTypeForm.value.value = indicatorValue.evaluation_answer.value.value;
    indicatorConditionalRangeTypeForm.value.optionId = indicatorValue.evaluation_answer.value.option_id;
  }
  if (indicatorValue.evaluation_parameter.type === 'conditional_radios' && indicatorValue.evaluation_answer.value) {
    indicatorConditionalRadioTypeForm.value.conditionalOptionId = indicatorValue.evaluation_answer.value.conditional_option_id;
    indicatorConditionalRadioTypeForm.value.optionId = indicatorValue.evaluation_answer.value.option_id;
  }
  if (indicatorValue.evaluation_parameter.type === 'climatic_zone' && indicatorValue.evaluation_answer.value.energy_consumption) {
    indicatorClimaticZoneTypeForm.value.energy_consumption = indicatorValue.evaluation_answer.value.energy_consumption;
    indicatorClimaticZoneTypeForm.value.edificacio_id = indicatorValue.evaluation_answer.value.edificacio_id;
  }
  if (indicatorValue.evaluation_parameter.type === 'percentages_ingredients_ponderats') {
    for (let i = 0; i < indicatorValue.evaluation_answer.value.length; i++) {
      let ingredientId = indicatorValue.evaluation_answer.value[i].ingredient_id;
      let index = indicatorPercentagesIngredientsPonderatsTypeForm.value.findIndex((row) => row.ingredient.id == ingredientId);
      indicatorPercentagesIngredientsPonderatsTypeForm.value[index].optionId = indicatorValue.evaluation_answer.value[i].option_id
    }
  }
  if (indicatorValue.evaluation_parameter.type === 'percentages_all_ingredients_ponderats') {
    for (let i = 0; i < indicatorValue.evaluation_answer.value.length; i++) {
      let ingredientId = indicatorValue.evaluation_answer.value[i].ingredient_id;
      let index = indicatorPercentagesAllIngredientsPonderatsTypeForm.value.findIndex((row) => row.ingredient.id == ingredientId);
      indicatorPercentagesAllIngredientsPonderatsTypeForm.value[index].optionId = indicatorValue.evaluation_answer.value[i].option_id
    }
  }
  if (indicatorValue.evaluation_parameter.type === 'percentages_all_ingredients_ponderats_na') {
    for (let i = 0; i < indicatorValue.evaluation_answer.value.length; i++) {
      let ingredientId = indicatorValue.evaluation_answer.value[i].ingredient_id;
      let index = indicatorPercentagesAllIngredientsPonderatsNaTypeForm.value.findIndex((row) => row.ingredient.id == ingredientId);
      indicatorPercentagesAllIngredientsPonderatsNaTypeForm.value[index].optionId = indicatorValue.evaluation_answer.value[i].option_id
    }
  }
}

const fetchIndicator = async () => {
  TraceabilityApiMethods
      .fetchIndicatorWithAnwser(indicatorIdRef.value, evaluableModelId)
      .then(data => indicator.value = data)
      .then(function () {
        if (indicator.value.evaluation_answer && indicator.value.evaluation_answer.status === 'dismissed') {
          dismiss_indicator_answer.value = true;
        }
        if (indicator.value.evaluation_parameter.type === 'percentages_ingredients_ponderats') {
          TraceabilityApiMethods.fetchProduct(evaluableModelId)
              .then(function (productData) {
                for (let i = 0; i < productData.ingredients.length; i++) {
                  indicatorPercentagesIngredientsPonderatsTypeForm.value.push({
                    ingredient: productData.ingredients[i],
                    optionId: null
                  });
                }
                fillAnswer(indicator.value);
                saveFormToDetectUserChanges();
              });
        } else if (indicator.value.evaluation_parameter.type === 'percentages_all_ingredients_ponderats') {
          TraceabilityApiMethods.fetchProduct(evaluableModelId)
              .then(function (productData) {
                let allIngredients = productData.ingredients.concat(productData.subingredients);
                allIngredients = Ingredients.sortAllIngredientsByParent(allIngredients);
                for (let i = 0; i < allIngredients.length; i++) {
                  indicatorPercentagesAllIngredientsPonderatsTypeForm.value.push({
                    ingredient: allIngredients[i],
                    optionId: null
                  });
                }
                fillAnswer(indicator.value);
                saveFormToDetectUserChanges();
              });
        } else if (indicator.value.evaluation_parameter.type === 'percentages_all_ingredients_ponderats_na') {
          TraceabilityApiMethods.fetchProduct(evaluableModelId)
              .then(function (productData) {
                let allIngredients = productData.ingredients.concat(productData.subingredients);
                allIngredients = Ingredients.sortAllIngredientsByParent(allIngredients);
                for (let i = 0; i < allIngredients.length; i++) {
                  indicatorPercentagesAllIngredientsPonderatsNaTypeForm.value.push({
                    ingredient: allIngredients[i],
                    optionId: null
                  });
                }
                fillAnswer(indicator.value);
                saveFormToDetectUserChanges();
              });
        } else {
          fillAnswer(indicator.value);
          saveFormToDetectUserChanges();
        }
        isDisabledByFormula.value = false;
        if (
            indicator.value.evaluation_parameter.formula != null &&
            indicator.value.evaluation_parameter.formula !== 'heterogeneitat_espacial_explotacio'
        ) {
          isDisabledByFormula.value = true;
        }
      });
}
const setNavigation = async () => {
  IndicatorNavigation
      .create(evaluableModelType, indicatorIdRef.value, evaluableModelId)
      .then(data => {
        navigation.value.exitUrl = data.exitUrl;
        navigation.value.previousIndicatorUrl = data.previousIndicatorUrl;
        navigation.value.nextIndicatorUrl = data.nextIndicatorUrl;
      })
}

const resetForm = () => {
  errorFields.value = [];
  indicatorRadioTypeForm.value.optionId = null;
  indicatorRangeTypeForm.value.value = null;
  indicatorClimaticZoneTypeForm.value.energy_consumption = null;
  indicatorClimaticZoneTypeForm.value.edificacio_id = null;
  previous_binary_question_answer.value = null;
  indicatorConditionalRangeTypeForm.value.value = null;
  indicatorConditionalRangeTypeForm.value.optionId = null;
  indicatorConditionalRadioTypeForm.value.conditionalOptionId = null;
  indicatorConditionalRadioTypeForm.value.optionId = null;
  indicatorRankingTypeForm.value.value = null;
  indicatorMultiplePercentagesPonderatsTypeForm.value.options = {};
  indicatorConditionalMultiplePercentagesPonderatsTypeForm.value.conditionalOptionId = null;
  indicatorConditionalMultiplePercentagesPonderatsTypeForm.value.options = {};
  indicatorPercentagesIngredientsPonderatsTypeForm.value = [];
  indicatorPercentagesAllIngredientsPonderatsTypeForm.value = [];
  indicatorPercentagesAllIngredientsPonderatsNaTypeForm.value = [];
  indicatorMultipleSimpleComponentsTypeForm.value.percentages = {};
  indicatorMultipleSimpleComponentsTypeForm.value.radioOptionsIds = {};
  indicatorMultipleSimpleComponentsTypeForm.value.multiplePercentages = {};
  indicatorMultipleSimpleComponentsTypeForm.value.conditionalOptionId = {};
  indicator.value = null;
  oldFormData = {}
  commonForm.value.answer = null;
  commonForm.value.comments = null;
  commonForm.value.does_not_apply = false;
  commonForm.value.clone_from_other_answer = null;
  commonForm.value.previous_binary_question_satisfied = null;
  commonForm.value.files = [];
  commonForm.value.formula = null;
  canBeDeleted.value = false;
  isDisabledByFormula.value = false;
  enabledFileUpload.value = false;
  uploadingFiles.value = false;
  inputFiles.value = null;
};

const deleteIndicatorAnswer = async () => {
  TraceabilityApiMethods
      .deleteIndicatorAnswer(indicatorIdRef.value, evaluableModelId)
      .then(() => SharedMethods.showSuccessfulToast(t('indicators.alert_messages.indicator_deleted')))
      .then(() => saveFormToDetectUserChanges())
      .then(() => ionContentElement.value.$el.scrollToTop(500))
      .then(async () => {
        pageIsLoading.value = true;
        const loadingPage = await SharedMethods.showLoadingPage();
        resetForm()
        fetchIndicator();
        setNavigation();
        pageIsLoading.value = false;
        loadingPage.dismiss();
      })
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });

}

const toggleDismissIndicatorAnswer = async (discard) => {
  TraceabilityApiMethods
      .toggleDismissIndicatorAnswer(indicatorIdRef.value, evaluableModelId)
      .then(() => {
        if (discard) {
          SharedMethods.showSuccessfulToast(t('indicators.alert_messages.indicator_discarted'));
        } else {
          SharedMethods.showSuccessfulToast(t('indicators.alert_messages.indicator_restored'));
        }
      })
      .then(() => saveFormToDetectUserChanges())
      .then(() => ionContentElement.value.$el.scrollToTop(500))
      .then(async () => {
        pageIsLoading.value = true;
        const loadingPage = await SharedMethods.showLoadingPage();
        resetForm()
        fetchIndicator();
        setNavigation();
        pageIsLoading.value = false;
        loadingPage.dismiss();
      })
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });

}

const saveIndicatorAnswer = async () => {
  errorFields.value = [];

  let indicatorTypeAnswer = IndicatorFormEvaluation.parseIndicatorTypeAnswerValue(
      indicator,
      indicator.value.evaluation_parameter.type,
      indicatorRadioTypeForm,
      indicatorRangeTypeForm,
      indicatorRankingTypeForm,
      indicatorClimaticZoneTypeForm,
      indicatorMultipleSimpleComponentsTypeForm,
      indicatorMultiplePercentagesPonderatsTypeForm,
      indicatorConditionalRangeTypeForm,
      indicatorConditionalRadioTypeForm,
      indicatorPercentagesIngredientsPonderatsTypeForm,
      indicatorConditionalMultiplePercentagesPonderatsTypeForm,
      indicatorPercentagesAllIngredientsPonderatsTypeForm,
      indicatorPercentagesAllIngredientsPonderatsNaTypeForm
  );

  const formData = IndicatorFormEvaluation.createFormData(
      indicator,
      commonForm,
      indicatorTypeAnswer.value
  );

  errorFields.value = [...errorFields.value, ...indicatorTypeAnswer.missingRequiredFields];

  let isValid = false
  try {
    isValid = IndicatorFormEvaluationValidate.validate(
        indicator,
        formData,
        previous_binary_question_answer,
        indicatorTypeAnswer.hasBeenAnswered
    );
  } catch (error) {
    if (error instanceof RequiredFieldError) {
      errorFields.value.push(error.fieldName);
    }
  }


  if (!isValid) {
    await SharedMethods.showErrorToast(t('indicators.alert_messages.invalid_submit'));
    return;
  }

  TraceabilityApiMethods
      .saveIndicatorAnswer(indicatorIdRef.value, evaluableModelId, formData)
      .then(() => SharedMethods.showSuccessfulToast('Canvis desats!'))
      .then(() => saveFormToDetectUserChanges())
      .then(function () {
        if (indicator.value.candidate_answers_to_replicate_to.length > 0) {
          openModalCandidatesToReplicateAnswers(indicator.value.candidate_answers_to_replicate_to);
        }
      })
      .then(() => ionContentElement.value.$el.scrollToTop(500))
      .then(() => canBeDeleted.value = true)
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });
}


watch(() => route.params, async (newParams) => {
  pageIsLoading.value = true;
  const loadingPage = await SharedMethods.showLoadingPage();
  indicatorIdRef.value = newParams.indicatorId;
  resetForm();
  fetchIndicator();
  setNavigation();
  pageIsLoading.value = false;
  loadingPage.dismiss();
});

onMounted(async function () {
  pageIsLoading.value = true;
  const loadingPage = await SharedMethods.showLoadingPage();
  fetchIndicator();
  setNavigation();
  pageIsLoading.value = false;
  loadingPage.dismiss();
});
</script>

<style scoped>
.file-item {
  display: flex;
  margin-top: 5px;
  align-items: center;
}

.file-item .file-name {
  margin-left: 15px;
}

.file-item .file-download {
  color: #3880ff;
  cursor: pointer;
}

ion-spinner {
  width: 15px;
  height: 15px;
}

.rich-text {
  line-height: 1.4rem;
}

.indicator-title {
  display: flex;
  align-items: center;
}

.indicator-title span {
  margin-left: 5px;
}

.indicator-description {
  margin-bottom: 10px;
}

.parameter-description {
  margin-top: 13px;
  background: white;
  border-radius: 10px;
  padding: 1px 20px;
}
</style>
