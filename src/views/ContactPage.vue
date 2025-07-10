<template>

  <guest-layout>
    <div id="container">

      <div class="center">




      </div>
    </div>
  </guest-layout>
</template>

<script setup>
import {IonItem, IonLabel, IonRadio, IonRadioGroup, IonTextarea, IonList, IonInput, IonButton} from '@ionic/vue';
import {useUserStore} from "@/store/user.store.js";
import {required, email, minLength} from '@vuelidate/validators'
import {computed, reactive, ref} from "vue";
import useVuelidate from "@vuelidate/core";
import GuestLayout from "@/layouts/GuestLayout.vue";
import SharedMethods from "@/shared/SharedMethods.js";
import Translation from "@/i18n/translation.js";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";

const userStore = useUserStore();

const form = reactive({
  response_preference: 'email',
  phone: '',
  email: '',
  message: '',
});

const rules = computed(() => {
  return {
    response_preference: {required},
    phone: {},
    email: {email},
    message: {required},
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
  await TraceabilityApiMethods.contact(form.response_preference, form.email, form.phone, form.message)
      .then(() => SharedMethods.showSuccessfulToast('Missatge enviat', 3000))
      .then(() => {
        form.response_preference = 'email';
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
          response_preference: errorResponse.errors?.response_preference?.[0],
          phone: errorResponse.errors?.phone?.[0],
          email: errorResponse.errors?.email?.[0],
          message: errorResponse.errors?.message?.[0],
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
  width: 600px;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
