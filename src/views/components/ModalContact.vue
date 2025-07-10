<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('contact.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="onSubmit" :strong="true" color="primary" shape="round" fill="solid">
          {{ $t('contact.send_btn') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">
    <h1 class="modal-title">{{ $t('contact.title') }}</h1>
    <p>{{ $t('contact.text') }}</p>
    <form @submit.prevent="onSubmit" novalidate>

      <div class="ion-input-mb">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('contact.email')"
            v-model="form.email"
            name="email"
            type="email"
            :spellcheck="false"
            autocapitalize="off"
        />
        <ValidationTextError :show="v.email.$error" :error-message="v.email.$errors[0]?.$message" />
      </div>

      <div class="ion-input-mb">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('contact.phone')"
            v-model="form.phone"
            name="phone"
            type="text"
        />
        <ValidationTextError :show="v.phone.$error" :error-message="v.phone.$errors[0]?.$message" />
      </div>

      <div class="ion-input-mb">
        <ion-textarea
            class="input-custom"
            fill="solid"
            label-placement="floating"
            v-model="form.message"
            name="message"
            :auto-grow="true"
            :label="$t('contact.message')"
            :rows=4
            :placeholder="$t('contact.message_placeholder')"/>

        <ValidationTextError :show="v.message.$error" :error-message="v.message.$errors[0]?.$message" />
      </div>
    </form>

  </ion-content>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonInput,
  IonTextarea,
  IonToolbar,
  modalController,
} from '@ionic/vue';

import ValidationTextError from "@/views/components/ValidationTextError.vue";

import {computed, reactive, ref} from "vue";
import useVuelidate from "@vuelidate/core";
import SharedMethods from "@/shared/SharedMethods.js";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {required, helpers, email} from "@vuelidate/validators";
import {useI18n} from "vue-i18n";

const form = reactive({
  phone: '',
  email: '',
  message: '',
});
const {t} = useI18n();

const rules = computed(() => {
  return {
    phone: {required: helpers.withMessage(t('validations.required'), required)},
    message: {required: helpers.withMessage(t('validations.required'), required)},
    email:  {
      required: helpers.withMessage(t('validations.required'), required),
      email: helpers.withMessage(t('validations.email'), email),
    },
  }
});

const $externalResults = ref({});
const v = useVuelidate(rules, form, {$externalResults});

const onSubmit = async () => {
  // Reset external results
  $externalResults.value = {};
  // check if everything is valid
  if (!await v.value.$validate()) return
  // Make the server call
  await TraceabilityApiMethods.contact(form.email, form.phone, form.message)
      .then(() => SharedMethods.showSuccessfulToast('Missatge enviat', 3000))
      .then(() => {
        form.phone = '';
        form.email = '';
        form.message = '';
        v.value.$reset();
      })
      .catch((errorResponse) => {
        if (!errorResponse.errors && errorResponse.message) {
          SharedMethods.showErrorToast(errorResponse.message);
          return;
        }

        $externalResults.value = {
          phone: errorResponse.errors?.phone?.[0],
          email: errorResponse.errors?.email?.[0],
          message: errorResponse.errors?.message?.[0],
        };
      });
};

const cancel = async () => modalController.dismiss(null, 'cancel');
</script>
