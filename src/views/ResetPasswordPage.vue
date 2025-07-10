<template>
  <guest-layout>
    <div id="container">

      <div class="center">

        <div class="header">
          <img src="/assets/logo-v.svg" alt="logo" class="logo">
        </div>

        <form @submit.prevent="onSubmit" novalidate>

          <div class="ion-input-mb">
            <ion-input
                :label="$t('reset_password.email_label')"
                class="input-custom"
                fill="solid"
                label-placement="floating"
                v-model="form.email"
                name="email"
                type="email"
                :spellcheck="false"
                autocapitalize="off"
                required
            />
            <ValidationTextError :show="v.email.$error" :error-message="v.email.$errors[0]?.$message" />
          </div>
          <div class="ion-input-mb">
            <ion-input
                :label="$t('reset_password.new_password_label')"
                class="input-custom"
                fill="solid"
                label-placement="floating"
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
                :label="$t('reset_password.new_password_confirmation_label')"
                class="input-custom"
                fill="solid"
                label-placement="floating"
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
            <ion-button expand="full" type="submit" size="default">
              {{ $t('reset_password.action') }}
            </ion-button>
          </div>
        </form>
      </div>
    </div>
  </guest-layout>
</template>

<script setup>
import {IonButton, IonInput} from '@ionic/vue';
import {computed, reactive, ref} from "vue";
import useVuelidate from "@vuelidate/core";
import GuestLayout from "@/layouts/GuestLayout.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import {useRoute, useRouter} from "vue-router";
import Translation from "@/i18n/translation.js";
import {email, required, helpers} from "@vuelidate/validators";
import ValidationTextError from "@/views/components/ValidationTextError.vue";
import {useI18n} from "vue-i18n";

const route = useRoute();
const router = useRouter();
const token = route.params.token;

const form = reactive({
  email: '',
  password: '',
  password_confirmation: '',
});
const {t} = useI18n();

const rules = computed(() => {
  return {
    email:  {
      required: helpers.withMessage(t('validations.required'), required),
      email: helpers.withMessage(t('validations.email'), email),
    },
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
  const responseData = await TraceabilityApiMethods.resetPassword(token, form.email, form.password, form.password_confirmation)
      .then((response) => SharedMethods.showSuccessfulToast(response.message, 3000))
      .then(() => {
        setTimeout(() => {
          router.push(Translation.i18nRoute({name: 'login'}));
        }, 1500);
      })
      .catch((errorResponse) => {
        if (!errorResponse.errors && errorResponse.message) {
          SharedMethods.showErrorToast(errorResponse.message);
          return;
        }

        $externalResults.value = {
          email: errorResponse.errors?.email?.[0],
          password: errorResponse.errors?.password?.[0],
        };
      });
};
</script>

<style scoped>
.logo {
  width: 65px;
}

#container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

#container .header {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  flex-direction: column;
  align-items: center;
}

#container .center {
  display: flex;
  min-width: 320px;
  flex-direction: column;
  padding: 20px;
}
</style>
