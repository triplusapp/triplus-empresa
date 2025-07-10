<template>
  <form @submit.prevent="submitFormCompany">

    <div>
      <ion-label class="ion-text-wrap">{{ $t('profile.indicators.company_type') }}</ion-label>
      <ion-radio-group v-model="companyFormData.cooperative_society">
        <div>
          <ion-radio :value="true" label-placement="end">Sí</ion-radio>
        </div>
        <div>
          <ion-radio :value="false" label-placement="end">No</ion-radio>
        </div>
      </ion-radio-group>
      <br>
    </div>

    <ion-label class="ion-text-wrap">{{ $t('profile.indicators.workers_num') }}</ion-label>

    <ion-input
        class="input-custom input-number"
        fill="solid"
        label-placement="floating"
        onwheel="return false;"
        type="number"
        v-model="companyFormData.num_workers"
        placeholder="Ex: 0"
        min="0" step="1"/>

    <ion-label class="ion-text-wrap">
      <p v-show="companyFormData.cooperative_society === true">{{ $t('profile.indicators.cooperative_yes') }}</p>
      <p v-show="companyFormData.cooperative_society === false">{{ $t('profile.indicators.cooperative_no') }}</p>
    </ion-label>

    <div v-show="companyFormData.cooperative_society===false">
      <br>
      <ion-label class="ion-text-wrap">
        <h3>{{ $t('profile.indicators.workers_num_assalariats') }}</h3>
      </ion-label>

      <ion-input
          class="input-custom input-number"
          fill="solid"
          label-placement="floating"
          onwheel="return false;"
          type="number"
          v-model="companyFormData.num_workers_assalariats"
          placeholder="Ex: 0"
          min="0" step="1"/>
    </div>


    <br>

    <ion-button color="medium" @click="cancelEditing" shape="round">
      {{ $t('global.cancel_btn') }}
    </ion-button>

    <ion-button type="submit" size="default" shape="round">
      {{ $t('global.save_btn') }}
    </ion-button>

  </form>
</template>

<script setup>
import {defineProps} from "vue";
import {alertController, IonButton, IonInput, IonLabel, IonRadio, IonRadioGroup} from '@ionic/vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const props = defineProps({
  companyFormData: Object,
});

const companyFormData = props.companyFormData;
const oldNumWorkers = companyFormData.num_workers;

const askDeleteIndicatorsIfNumWorkersChanged = async (formData) => {
  if (oldNumWorkers === formData.num_workers) {
    updateCompanyData(formData);
    return;
  }

  const response = await TraceabilityApiMethods.companyHadAnsweredNumWorkersRelatedIndicadors();

  if (!response.had_answered) {
    updateCompanyData(formData);
    return;
  }
  const alertButtons = [
    {
      text: t('global.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('profile.indicators.confirm_delete_indicators_when_num_workers_changed.confirm_btn'),
      role: 'confirm',
      handler: () => updateCompanyData(formData),
    },
  ];
  const alert = await alertController.create({
    header: t('profile.indicators.confirm_delete_indicators_when_num_workers_changed.title'),
    message: t('profile.indicators.confirm_delete_indicators_when_num_workers_changed.message'),
    buttons: alertButtons,
  });
  await alert.present();
}


const submitFormCompany = async () => {
  // Validate data
  const formData = {
    num_workers: parseInt(companyFormData.num_workers),
    num_workers_assalariats: companyFormData.num_workers_assalariats !== null ? parseInt(companyFormData.num_workers_assalariats) : null,
    cooperative_society: companyFormData.cooperative_society,
  };

  if (formData.cooperative_society === null || isNaN(formData.num_workers)) {
    SharedMethods.showErrorToast(t('profile.indicators.alert_messages.required_fields'));
    return;
  }

  if (!formData.cooperative_society && formData.num_workers_assalariats > formData.num_workers) {
    SharedMethods.showErrorToast(t('profile.indicators.alert_messages.more_assalariats_than_workers'));
    return;
  }

  askDeleteIndicatorsIfNumWorkersChanged(formData);
}
const updateCompanyData = async (formData) => {
  // Update
  TraceabilityApiMethods.updateCompanyIndicatorsData(formData)
      .then(() => SharedMethods.showSuccessfulToast(t('global.alert_messages.saved')))
      .then(() => window.location.reload())
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });
}

const emit = defineEmits(['cancel-editing']);
const cancelEditing = () => emit('cancel-editing');
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}
</style>
