<template>
  <guest-layout>
    <div id="container">

      <div class="center">

        <p>{{ $t('forgot_password.info') }}</p>

        <form @submit.prevent="onSubmit" novalidate>

          <div class="ion-input-mb">
            <ion-input
                class="input-custom"
                fill="solid"
                label-placement="floating"
                :label="$t('forgot_password.email_label')"
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
            <ion-button expand="full" size="default" shape="round" type="submit">
              {{ $t('forgot_password.action') }}
            </ion-button>
          </div>
        </form>
      </div>
    </div>
  </guest-layout>
</template>

<script setup>
import {IonButton, IonInput} from '@ionic/vue';
import {email, required, helpers} from "@vuelidate/validators";
import ValidationTextError from "@/views/components/ValidationTextError.vue";

import {computed, reactive, ref} from "vue";
import useVuelidate from "@vuelidate/core";
import GuestLayout from "@/layouts/GuestLayout.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import {useI18n} from "vue-i18n";
const {t} = useI18n();
const form = reactive({
  email: '',
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
  const responseData = await TraceabilityApiMethods.forgotPassword(form.email)
      .then((response) => SharedMethods.showSuccessfulToast(response.message, 3000))
      .catch((error) => $externalResults.value = {email: error});
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
</style>
