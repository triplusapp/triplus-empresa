<template>
  <form @submit.prevent="onSubmit" novalidate>

    <div class="ion-input-mb">
      <ion-input
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('settings.account.email')"
          v-model="form.email"
          name="email"
          type="email"
          :spellcheck="false"
          autocapitalize="off"
          required
      />
      <ValidationTextError :show="v.email.$error" :error-message="v.email.$errors[0]?.$message" />
    </div>

    <div>
      <ion-button expand="full" type="submit" size="default" shape="round">
        {{ $t('settings.account.update_mail_btn') }}
      </ion-button>
    </div>
  </form>
</template>

<script setup>
import {IonButton, IonInput} from "@ionic/vue";
import {computed, reactive, ref} from "vue";
import {required, helpers, email} from "@vuelidate/validators";
import ValidationTextError from "@/views/components/ValidationTextError.vue";
import useVuelidate from "@vuelidate/core";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import {useUserStore} from "@/store/user.store.js";
import {useI18n} from "vue-i18n";
const {t} = useI18n();

const userStore = useUserStore();
const user = userStore.user;

const form = reactive({
  email: user.email,
});

const rules = computed(() => {
  return {
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
  const responseData = await TraceabilityApiMethods.updateUserEmail(form.email)
      .then(() => userStore.updateEmail(form.email))
      .then(() => SharedMethods.showSuccessfulToast(t('settings.account.alert_messages.mail_updated'), 3000))
      .catch((errorResponse) => {
        if (!errorResponse.errors && errorResponse.message) {
          SharedMethods.showErrorToast(errorResponse.message);
          return;
        }
        $externalResults.value = {
          email: errorResponse.errors?.email?.[0],
        };
      });
};

</script>
