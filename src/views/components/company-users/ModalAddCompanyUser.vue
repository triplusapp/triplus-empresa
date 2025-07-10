<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="createUser" :strong="true" color="primary" shape="round" fill="solid">
          {{ $t('settings.users.add_user_modal.confirm_btn') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">

    <h1 class="modal-title">{{ $t('settings.users.add_user_modal.title') }}</h1>
    <p>{{ $t('settings.users.add_user_modal.message') }}</p>

    <form @submit.prevent="createUser" novalidate>

      <div class="ion-input-mb">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('settings.users.user_name')"
            v-model="form.name"
            name="name"
            type="text"
            required
        />
        <ValidationTextError :show="v.name.$error" :error-message="v.name.$errors[0]?.$message" />
      </div>

      <div class="ion-input-mb">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('settings.users.user_email')"
            v-model="form.email"
            name="email"
            type="email"
            :spellcheck="false"
            autocapitalize="off"
            required
        />
        <ValidationTextError :show="v.email.$error" :error-message="v.email.$errors[0]?.$message" />
      </div>
    </form>

  </ion-content>
</template>

<script setup>
import {IonButton, IonButtons, IonContent, IonFooter, IonInput, IonToolbar, modalController,} from '@ionic/vue';
import {computed, reactive, ref} from 'vue';
import SharedMethods from "@/shared/SharedMethods.js";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import useVuelidate from "@vuelidate/core";
import {email, required, helpers} from "@vuelidate/validators";
import ValidationTextError from "@/views/components/ValidationTextError.vue";
import {useI18n} from "vue-i18n";

const form = reactive({
  name: '',
  email: '',
});

const {t} = useI18n();

const rules = computed(() => {
  return {
    name:  {
      required: helpers.withMessage(t('validations.required'), required),
    },
    email:  {
      required: helpers.withMessage(t('validations.required'), required),
      email: helpers.withMessage(t('validations.email'), email),
    },
  }
});
const $externalResults = ref({});
const v = useVuelidate(rules, form, {$externalResults});


const cancel = () => {
  modalController.dismiss(null, 'cancel');
};

const createUser = async () => {
  // Reset external results
  $externalResults.value = {};
  // check if everything is valid
  if (!await v.value.$validate()) return
  // Make the server call

  await TraceabilityApiMethods.addCompanyUser(form.name, form.email)
      .then(() => {
        modalController.dismiss(null, 'created');
      })
      .catch((errorResponse) => {
        if (!errorResponse.errors && errorResponse.message) {
          SharedMethods.showErrorToast(errorResponse.message);
          return;
        }

        $externalResults.value = {
          email: errorResponse.errors?.email?.[0],
          password: errorResponse.errors?.password?.[0],
          company_name: errorResponse.errors?.company_name?.[0],
          name: errorResponse.errors?.name?.[0],
        };
      });
};


</script>

<style scoped>

</style>

