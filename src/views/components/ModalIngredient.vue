<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="modal-title">
        {{ modalTitle }}
      </ion-title>
      <ion-buttons slot="end">
        <ion-button type="button" size="small" fill="clear" color="danger" @click="deleteIngredient" class="delete-btn">
          <ion-icon slot="start" :icon="trashBin()"></ion-icon>
          Eliminar
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="update" :strong="true" color="primary" fill="solid" shape="round">
          {{ $t('ingredients.save_btn') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content>
    <p class="ion-padding" style="margin-top: 0;padding-top: 0;padding-bottom: 0;">{{ modalText }}</p>
    <div class="ion-padding">
      <div class="input-wrapper">
        <TranslatableInput :label="labelIngredientName" :placeholder="placeholderIngredient" v-model="ingredient.name"/>
        <ValidationTextError :show="missingFields.name"/>
<!--        <ValidationTextError :show="missingFields.name" :error-message="$t('validations.multilang_required')"/>-->
      </div>

      <div class="input-wrapper">
        <ion-select
            :label="$t('ingredients.weight_percentage')"
            v-model="ingredient.percentage"
            class="input-custom"
            fill="solid"
            label-placement="floating"
            placeholder="%">
          <ion-select-option v-for="row in availablePercentages" :value="row.percentage">
            {{ row.label }}
          </ion-select-option>
        </ion-select>
        <ValidationTextError :show="missingFields.percentage"/>
      </div>

      <div v-if="locationEnabled">
        <div class="location-title" style="margin-bottom: 0.25rem;">
          <ion-icon :icon="locationSharp()"></ion-icon>
          <label>
            {{ $t('products.manage.ingredient_location') }}
          </label>
        </div>

        <div
            class="sc-ion-input-md-h sc-ion-input-md-s md input-fill-outline has-value input-label-placement-">
          <label class="input-wrapper sc-ion-input-md">
            <div class="input-outline-container sc-ion-input-md" style="background-color: #fff;">
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
                  v-model="ingredient.formatted_address"
                  :placeholder="$t('ingredients.location_placeholder')"
                  types="geocode"
                  :disabled="ingredient.unknown_location"
                  v-on:placechanged="setAddress"
                  classname="native-input sc-ion-input-md"/>
            </div>
          </label>
        </div>

        <div class="input-wrapper">
          <label>
            <input type="checkbox" :value="true" v-model="ingredient.unknown_location" @change="unknownLocation">
            {{ $t('ingredients.unknown_location') }}
          </label>
        </div>
        <ValidationTextError :show="missingFields.location"/>
      </div>
    </div>
  </ion-content>
</template>

<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import {informationCircleOutline, locationSharp, trashBin} from "ionicons/icons";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import {defineComponent, nextTick, ref} from 'vue';
import TranslatableInput from "@/views/components/TranslatableInput.vue";
import {useI18n} from "vue-i18n";
import SharedMethods from "@/shared/SharedMethods.js";
import ValidationTextError from "@/views/components/ValidationTextError.vue";

export default defineComponent({
  setup() {
    const {t} = useI18n();
    const missingFields = ref({
      name: false,
      percentage: false,
      location: false,
    });
    return {
      t,
      missingFields,
    };
  },
  props: {
    availablePercentages: {
      type: Array
    },
    indexKey: {
      type: Number
    },
    parentIndexKey: {
      type: Number
    },
    name: {
      type: Object
    },
    percentage: {
      type: Number
    },
    locationEnabled: {
      type: Boolean
    },
    unknown_location: {
      type: Boolean
    },
    formatted_address: {
      type: String
    },
    latitude: {
      type: String
    },
    longitude: {
      type: String
    },
    address_components: {
      type: Object,
    }
  },
  data() {
    return {
      ingredient: {
        name: this.name,
        percentage: this.percentage,
        unknown_location: this.unknown_location,
        formatted_address: this.formatted_address,
        address_components: this.address_components,
        latitude: this.latitude,
        longitude: this.longitude,
      },
    }
  },
  components: {
    ValidationTextError,
    TranslatableInput,
    IonModal,
    VueGoogleAutocomplete,
    IonHeader,
    IonSelect, IonSelectOption,
    IonFooter, IonTitle, IonToolbar, IonContent, IonButtons, IonButton, IonInput, IonIcon
  },
  methods: {
    setAddress(addressData, placeResultData) {
      this.ingredient.address_components = placeResultData.address_components;
      this.ingredient.formatted_address = placeResultData.formatted_address;
      this.ingredient.latitude = addressData.latitude;
      this.ingredient.longitude = addressData.longitude;
    },
    informationCircleOutline() {
      return informationCircleOutline
    },
    trashBin() {
      return trashBin
    },
    locationSharp() {
      return locationSharp
    },
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    update() {
      this.missingFields.name = !SharedMethods.isValidMultilangField(this.ingredient.name);
      this.missingFields.percentage = this.ingredient.percentage === null;

      if (this.locationEnabled) {
        this.missingFields.location = !this.ingredient.unknown_location && !this.ingredient.longitude;
      } else {
        this.missingFields.location = false;
      }

      const validFormData = !this.missingFields.name && !this.missingFields.percentage && !this.missingFields.location;
      if (!validFormData) {
        return;
      }

      const action = (this.indexKey === null) ? 'create' : 'update';
      return modalController.dismiss({
        indexKey: this.indexKey,
        parentIndexKey: this.parentIndexKey,
        name: this.ingredient.name,
        percentage: Number(this.ingredient.percentage),
        unknown_location: this.ingredient.unknown_location,
        formatted_address: this.ingredient.formatted_address,
        address_components: this.ingredient.address_components,
        latitude: this.ingredient.latitude,
        longitude: this.ingredient.longitude,
      }, action);
    },
    deleteIngredient() {
      return modalController.dismiss({
        indexKey: this.indexKey,
        parentIndexKey: this.parentIndexKey,
      }, 'delete');
    },
    unknownLocation() {
      if (this.ingredient.unknown_location) {
        this.ingredient.formatted_address = null;
        this.ingredient.address_components = null;
        this.ingredient.latitude = null;
        this.ingredient.longitude = null;
      }
    },
  },
  computed: {
    modalTitle() {
      if (this.parentIndexKey === null) {
        return this.t('ingredients.title_ingredient');
      } else {
        return this.t('ingredients.title_subingredient');
      }
    },
    modalText() {
      if (this.parentIndexKey === null) {
        return this.t('ingredients.message_ingredient');
      } else {
        return this.t('ingredients.message_subingredient');
      }
    },
    labelIngredientName() {
      if (this.parentIndexKey === null) {
        return this.t('ingredients.ingredient_label');
      } else {
        return this.t('ingredients.subingredient_label');
      }
    },
    placeholderIngredient() {
      if (this.parentIndexKey === null) {
        return this.t('ingredients.ingredient_placeholder');
      } else {
        return this.t('ingredients.subingredient_placeholder');
      }
    }
  },
  mounted() {
    nextTick(() => {
      if (this.ingredient.formatted_address && this.$refs.autocomplete) {
        this.$refs.autocomplete.$el.value = this.ingredient.formatted_address;
      }
    });
  }
});
</script>

<style scoped>

.input-wrapper {
  margin-bottom: 1.5rem;
}

.location-title {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

</style>
