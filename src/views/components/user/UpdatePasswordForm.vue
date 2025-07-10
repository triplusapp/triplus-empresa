<template>
  <form @submit.prevent="onSubmit" novalidate>

    <div class="ion-input-mb">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('settings.account.current_password')"
          v-model="form.old_password"
          name="password"
          type="password"
          :spellcheck="false"
          autocapitalize="off"
          required
      />
      <ValidationTextError :show="v.old_password.$error" :error-message="v.old_password.$errors[0]?.$message" />
    </div>
    <div class="ion-input-mb">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('settings.account.new_password')"
          v-model="form.password"
          name="password"
          type="password"
          :spellcheck="false"
          autocapitalize="off"
          required
      />
      <ValidationTextError :show="v.password.$error" :error-message="v.password.$errors[0]?.$message" />
    </div>
    <div class="ion-input-mb">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('settings.account.password_confirmation')"
          v-model="form.password_confirmation"
          name="password_confirmation"
          type="password"
          :spellcheck="false"
          autocapitalize="off"
          required
      />
      <ValidationTextError :show="v.password_confirmation.$error" :error-message="v.password_confirmation.$errors[0]?.$message" />
    </div>
    <div>

      <ion-button expand="full" type="submit" size="default" shape="round">
        {{ $t('settings.account.update_password_btn') }}
      </ion-button>
    </div>
  </form>
</template>

<script setup>
import {IonButton, IonInput} from "@ionic/vue";
import {computed, reactive, ref} from "vue";
import {required, helpers} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";

import {useI18n} from "vue-i18n";
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const {t} = useI18n();


const form = reactive({
  old_password: '',
  password: '',
  password_confirmation: '',
});


const rules = computed(() => {
  return {
    old_password: {required: helpers.withMessage(t('validations.required'), required)},
    password: {required: helpers.withMessage(t('validations.required'), required)},
    password_confirmation: {required: helpers.withMessage(t('validations.required'), required)},
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
  const responseData = await TraceabilityApiMethods.updateUserPassword(
      form.old_password,
      form.password,
      form.password_confirmation
  )
      .then(() => SharedMethods.showSuccessfulToast(t('settings.account.alert_messages.password_updated'), 3000))
      .then(() => {
        form.old_password = '';
        form.password = '';
        form.password_confirmation = '';
        v.value.$reset();
      })
      .catch((errorResponse) => {
        if (!errorResponse.errors && errorResponse.message) {
          SharedMethods.showErrorToast(errorResponse.message);
          return;
        }
        $externalResults.value = {
          old_password: errorResponse.errors?.old_password?.[0],
          password: errorResponse.errors?.password?.[0],
        };
      });
};

</script>
