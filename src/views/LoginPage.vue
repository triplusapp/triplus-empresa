<template>
  <guest-layout>
    <div id="container">

      <div class="center">

        <div class="header">
          <img src="/assets/logo-v.svg" alt="logo" class="logo">
          <h1>{{ $t('auth.login.welcome') }}</h1>
          <div>{{ $t('auth.login.intro') }}</div>
        </div>

        <form @submit.prevent="onLogin" novalidate>

          <div class="ion-input-mb">
            <ion-input
                class="input-custom"
                fill="solid"
                label-placement="floating"
                :label="$t('auth.login.email')"
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
                :label="$t('auth.login.password')"
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
            <ion-button expand="full" type="submit" size="default" shape="round">Iniciar sessió</ion-button>
          </div>
        </form>
        <ion-button fill="clear" size="small"
                    style="margin: 10px 0;"
                    :router-link="Translation.i18nRoute({ name: 'forgot-password' })">
          {{ $t('auth.login.forgot_password_btn') }}
        </ion-button>
        <div style="display: flex;align-items: center;">
          <small>{{ $t('auth.login.no_account_text') }}</small>
          <ion-button fill="clear" size="small"
                      :router-link="Translation.i18nRoute({ name: 'register' })">
            {{ $t('auth.login.register_btn') }}
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
import Translation from "@/i18n/translation.js";
import {email, required, helpers} from "@vuelidate/validators";
import ValidationTextError from "@/views/components/ValidationTextError.vue";
import {useI18n} from "vue-i18n";

const userStore = useUserStore();

const form = reactive({
  email: '',
  password: '',
});
const {t} = useI18n();

const rules = computed(() => {
  return {
    email:  {
      required: helpers.withMessage(t('validations.required'), required),
      email: helpers.withMessage(t('validations.email'), email),
    },
    password:  {
      required: helpers.withMessage(t('validations.required'), required),
    },
  }
});

const $externalResults = ref({});
const v = useVuelidate(rules, form, {$externalResults});

const onLogin = async () => {
  // Reset external results
  $externalResults.value = {};
  // check if everything is valid
  if (!await v.value.$validate()) return
  // Make the server call
  await userStore.login(form.email, form.password)
      .catch((error) => {
        userStore.clearAll();
        $externalResults.value = {email: error};
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
