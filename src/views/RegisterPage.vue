<template>
  <guest-layout>
    <div id="container">

      <div class="center">

        <div class="header">
          <img src="/assets/logo-v.svg" alt="logo" class="logo">
          <div>{{ $t('auth.register.intro') }}</div>
        </div>

        <form @submit.prevent="onRegister" novalidate>

          <div class="ion-input-mb">
            <ion-input
                class="input-custom"
                fill="solid"
                label-placement="floating"
                :label="$t('auth.register.legal_name')"
                v-model="form.company_name"
                name="company_name"
                type="text"
                :spellcheck="false"
                autocapitalize="off"
                required
            />
            <ValidationTextError :show="v.company_name.$error" :error-message="v.company_name.$errors[0]?.$message" />
          </div>

          <div class="ion-input-mb">
            <ion-input
                class="input-custom"
                fill="solid"
                label-placement="floating"
                :label="$t('auth.register.name')"
                v-model="form.name"
                name="name"
                type="text"
                :spellcheck="false"
                autocapitalize="off"
                required
            />
            <ValidationTextError :show="v.name.$error" :error-message="v.name.$errors[0]?.$message" />
          </div>

          <div class="ion-input-mb">
            <ion-input
                class="input-custom"
                fill="solid"
                label-placement="floating"
                :label="$t('auth.register.email')"
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
                class="input-custom"
                fill="solid"
                label-placement="floating"
                :label="$t('auth.register.password')"
                v-model="form.password"
                name="password"
                type="password"
                :spellcheck="false"
                autocapitalize="off"
                required
            />
            <ValidationTextError :show="v.password.$error" :error-message="v.password.$errors[0]?.$message" />
          </div>
          <div>
            <ion-button expand="full" type="submit" size="default" shape="round">
              {{ $t('auth.register.register_btn') }}
            </ion-button>
          </div>
        </form>

        <div style="display: flex;align-items: center;">
          <small>{{ $t('auth.register.already_registered_text') }}</small>
          <ion-button fill="clear" size="small" :router-link="Translation.i18nRoute({ name: 'login' })">
            {{ $t('auth.register.login') }}
          </ion-button>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script setup>
import {IonButton, IonInput} from '@ionic/vue';
import {useUserStore} from "@/store/user.store.js";
import {computed, reactive, ref} from "vue";
import useVuelidate from "@vuelidate/core";
import GuestLayout from "@/layouts/GuestLayout.vue";
import SharedMethods from "@/shared/SharedMethods.js";
import Translation from "@/i18n/translation.js";

import {email, required, helpers, minLength} from "@vuelidate/validators";
import ValidationTextError from "@/views/components/ValidationTextError.vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const userStore = useUserStore();

const form = reactive({
  company_name: '',
  name: '',
  email: '',
  password: '',
});

const rules = computed(() => {
  return {
    company_name: {required: helpers.withMessage(t('validations.required'), required)},
    name: {required: helpers.withMessage(t('validations.required'), required)},
    email: {
      required: helpers.withMessage(t('validations.required'), required),
      email: helpers.withMessage(t('validations.email'), email),
    },
    password: {
      required: helpers.withMessage(t('validations.required'), required),
      minLength: helpers.withMessage(t('validations.minLength', {num: 8}), minLength(8))
    },
  }
})
  ;
  const $externalResults = ref({});
  const v = useVuelidate(rules, form, {$externalResults});

  const onRegister = async () => {
    // Reset external results
    $externalResults.value = {};
    // check if everything is valid
    if (!await v.value.$validate()) return
    // Make the server call
    await userStore.register(form.company_name, form.name, form.email, form.password, Translation.currentLocale)
        .catch((errorResponse) => {
          userStore.clearAll();

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
#container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

#container .center {
  display: flex;
  min-width: 320px;
  flex-direction: column;
  padding: 20px;
}

#container .header {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 100px;
}
</style>
