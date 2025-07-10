<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('contact.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="saveEdificacio" :strong="true" color="primary" shape="round" fill="solid">
          {{ $t('profile.auditories.edificacio_manage.add_btn') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">

    <h1 v-show="!isEditMode" class="modal-title">{{ $t('profile.auditories.edificacio_manage.title_add') }}</h1>
    <h1 v-show="isEditMode" class="modal-title">{{ $t('profile.auditories.edificacio_manage.title_edit') }}</h1>

    <p>{{ $t('profile.auditories.edificacio_manage.message') }}</p>

    <form @submit.prevent="saveEdificacio" novalidate>
      <div class="ion-input-mb">
        <ion-select
            v-model="form.edificacio_type"
            :label="$t('profile.auditories.edificacio_manage.edificacio_type')"
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :placeholder="$t('profile.auditories.edificacio_manage.edificacio_type_placeholder')"
        >
          <ion-select-option
              v-for="type in edificacionsTypes"
              :key="type.id"
              :value="type.id">
            {{ type.name }}
          </ion-select-option>
        </ion-select>

        <div class="input-error-message" v-if="v.edificacio_type.$error">{{
            v.edificacio_type.$errors[0].$message
          }}
        </div>
      </div>

      <div class="ion-input-mb">
        <ion-input
            class="input-custom"
            fill="solid"
            label-placement="floating"
            :label="$t('profile.auditories.edificacio_manage.name')"
            v-model="form.name"
            name="name"
            :placeholder="$t('profile.auditories.edificacio_manage.name_placeholder')"
            type="text"
            required
        />
        <div class="input-error-message" v-if="v.name.$error">{{ v.name.$errors[0].$message }}</div>
      </div>

      <div
          class="sc-ion-input-md-h sc-ion-input-md-s md input-fill-outline has-value input-label-placement-">
        <label class="input-wrapper sc-ion-input-md">
          <div class="input-outline-container sc-ion-input-md" style="background-color: #fff">
            <div class="input-outline-start sc-ion-input-md"></div>
            <div class="input-outline-notch sc-ion-input-md">
              <div class="notch-spacer sc-ion-input-md" aria-hidden="true"></div>
            </div>
            <div class="input-outline-end sc-ion-input-md"></div>
          </div>
          <div class="native-wrapper sc-ion-input-md">
            <vue-google-autocomplete
                ref="autocomplete"
                id="map"
                v-model="form.location"
                :placeholder="$t('profile.auditories.edificacio_manage.search_address')"
                types="geocode"
                v-on:placechanged="setAddress"
                classname="native-input sc-ion-input-md"/>
          </div>
        </label>
      </div>

      <div class="coordinates-wrapper">
        <div>
          <ion-input
              class="input-custom"
              fill="solid"
              label-placement="floating"
              :label="$t('profile.auditories.edificacio_manage.latitude')"
              type="text"
              :placeholder="$t('profile.auditories.edificacio_manage.latitude_placeholder')"
              v-model="form.latitude"/>
          <div class="input-error-message" v-if="v.latitude.$error">{{ v.latitude.$errors[0].$message }}</div>
        </div>
        <div>
          <ion-input
              class="input-custom"
              fill="solid"
              label-placement="floating"
              :label="$t('profile.auditories.edificacio_manage.longitude')"
              type="text"
              :placeholder="$t('profile.auditories.edificacio_manage.longitude_placeholder')"
              v-model="form.longitude"/>
          <div class="input-error-message" v-if="v.longitude.$error">{{ v.longitude.$errors[0].$message }}</div>
        </div>
      </div>


    </form>

  </ion-content>
</template>

<script setup>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonInput,
  IonToolbar,
  modalController,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import {defineProps, computed, reactive, ref, onMounted, nextTick} from 'vue';
import SharedMethods from "@/shared/SharedMethods.js";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useI18n} from "vue-i18n";

const props = defineProps({
  edificacio: Object,
  edificacionsTypes: Array
});
const isEditMode = ref(!!props.edificacio);

const autocomplete = ref(null);

const form = reactive({
  name: props.edificacio?.name || '',
  edificacio_type: props.edificacio?.type?.id || null,
  location: props.edificacio?.location || '',
  latitude: props.edificacio?.latitude || '',
  longitude: props.edificacio?.longitude || '',
  address_components: props.edificacio?.address_components || '',
});

const edificacionsTypes = ref(props.edificacionsTypes);

const {t} = useI18n();

const rules = computed(() => {
  return {
    name: {required: helpers.withMessage(t('validations.required'), required)},
    edificacio_type: {required: helpers.withMessage(t('validations.required'), required)},
    location: {},
    latitude: {required: helpers.withMessage(t('validations.required'), required)},
    longitude: {required: helpers.withMessage(t('validations.required'), required)},
  }
});
const $externalResults = ref({});
const v = useVuelidate(rules, form, {$externalResults});

const cancel = () => {
  modalController.dismiss(null, 'cancel');
};

const setAddress = function (addressData, placeResultData, id) {
  form.location = placeResultData.formatted_address;
  form.latitude = addressData.latitude;
  form.longitude = addressData.longitude;
  form.address_components = placeResultData.address_components;
};

const saveEdificacio = async () => {
  // Reset external results
  $externalResults.value = {};
  // check if everything is valid
  if (!await v.value.$validate()) return
  // Make the server call

  const apiMethod = isEditMode.value
      ? () => TraceabilityApiMethods.updateEdificacio(props.edificacio.id, form.edificacio_type, form.name, form.location, form.latitude, form.longitude, form.address_components)
      : () => TraceabilityApiMethods.addEdificacio(form.edificacio_type, form.name, form.location, form.latitude, form.longitude, form.address_components);

  try {
    await apiMethod();
    modalController.dismiss(null, isEditMode.value ? 'updated' : 'created');
  } catch (errorResponse) {
    if (!errorResponse.errors && errorResponse.message) {
      SharedMethods.showErrorToast(errorResponse.message);
      return;
    }

    $externalResults.value = {
      edificacio_type: errorResponse.errors?.edificacio_type?.[0],
      name: errorResponse.errors?.name?.[0],
      latitude: errorResponse.errors?.latitude?.[0],
      longitude: errorResponse.errors?.longitude?.[0],
    };
  }
};

onMounted(() => {
  if (isEditMode.value && form.location) {
    nextTick(() => {
      if (autocomplete.value) {
        autocomplete.value.$el.value = form.location;
      }
    });
  }
});
</script>

<style scoped>
.coordinates-wrapper {
  display: flex;
  margin-top: 2rem;
  gap: 1.5rem;
}

.coordinates-wrapper > div {
  width: 50%;
}
</style>

