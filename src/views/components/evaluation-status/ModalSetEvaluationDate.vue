<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="saveEvaluationDate" :strong="true" color="primary" shape="round" fill="solid">
          {{ $t('evaluation_date.save') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">

    <h1 class="modal-title">{{ $t('evaluation_date.title') }}</h1>
    <p>{{ $t('evaluation_date.message') }}</p>

    <form @submit.prevent="saveEvaluationDate" novalidate>

      <div class="ion-input-mb">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('evaluation_date.input')"
            v-model="form.evaluation_date"
            name="evaluation_date"
            type="date"
            required
        />
        <div class="input-error-message" v-if="v.evaluation_date.$error">{{ v.evaluation_date.$errors[0].$message }}</div>
      </div>
    </form>

  </ion-content>
</template>

<script setup>
import {IonButton, IonButtons, IonContent, IonFooter, IonInput, IonToolbar, modalController,} from '@ionic/vue';
import {computed, reactive, ref} from 'vue';
import SharedMethods from "@/shared/SharedMethods.js";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const form = reactive({
  evaluation_date: '',
});

const rules = computed(() => {
  return {
    evaluation_date: {required},
  }
});
const $externalResults = ref({});
const v = useVuelidate(rules, form, {$externalResults});

const cancel = () => {
  modalController.dismiss(null, 'cancel');
};

const saveEvaluationDate = async () => {
  // Reset external results
  $externalResults.value = {};
  // check if everything is valid
  if (!await v.value.$validate()) return
  // Make the server call

  await TraceabilityApiMethods.updateCompanyValidationDate(form.evaluation_date)
      .then(() => {
        modalController.dismiss(null, 'saved');
      })
      .catch((errorResponse) => {
        if (!errorResponse.errors && errorResponse.message) {
          SharedMethods.showErrorToast(errorResponse.message);
          return;
        }

        $externalResults.value = {
          evaluation_date: errorResponse.errors?.evaluations_open_at?.[0],
        };
      });
};
</script>

