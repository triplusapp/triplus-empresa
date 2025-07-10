<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title v-show="!productId">{{ $t('products.manage.creation_page_title') }}</ion-title>
        <ion-title v-show="productId">
          {{ $t('products.manage.edition_page_title', {product: product?.name}) }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">

        <form @submit.prevent="submitFormProduct">
          <div class="input-wrapper">
            <media-library-collection
                v-if="productFetched || !productId"
                :upload-domain="APISettings.baseURL"
                name="media"
                :validation-rules="{ accept: ['image/png', 'image/jpeg'], maxSizeInKB: 1024*5 }"
                :translations="$tm('media-library')"
                @is-ready-to-submit-change="mediaIsReadyToSubmit = $event"
                @change="onMediaChange"
                :initial-value="initialMedia"
            />

            <div class="help-text-wrapper">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
              <small>{{ $t('products.manage.media_help_text') }}</small>
            </div>
            <ValidationTextError :show="missingRequiredFields.includes('media')"/>
          </div>

          <div class="input-wrapper">
            <TranslatableInput :label="$t('products.manage.product_name_label')"
                               v-model="productFormData.name"
                               v-if="productFetched || !productId"/>
            <div class="help-text-wrapper">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
              <small>{{ $t('products.manage.product_name_help_text') }}</small>
            </div>
            <ValidationTextError :show="missingRequiredFields.includes('name')"/>
<!--                                 :error-message="$t('validations.multilang_required')"/>-->
          </div>

          <div class="input-wrapper">
            <TranslatableInput :label="$t('products.manage.format_label')"
                               v-model="productFormData.format"
                               v-if="productFetched || !productId"/>
            <div class="help-text-wrapper">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
              <small>{{ $t('products.manage.format_help_text') }}</small>
            </div>
            <ValidationTextError :show="missingRequiredFields.includes('name')" />
<!--                                 :error-message="$t('validations.multilang_required')"/>-->
          </div>

          <div class="input-wrapper">
            <ion-select
                :label="$t('products.manage.brand_name_label')"
                v-model="productFormData.brand_id"
                class="input-custom"
                fill="solid"
                label-placement="floating"
                placeholder="Selecciona una marca">
              <ion-select-option v-for="brand in companyBrands" :value="brand.id">
                {{ brand.name }}
              </ion-select-option>
            </ion-select>
            <ValidationTextError :show="missingRequiredFields.includes('brand_id')"/>
          </div>

          <div class="input-wrapper">
            <ion-input v-model="productFormData.barcode"
                       class="input-custom"
                       v-show="!noBarcode"
                       :disabled="noBarcode"
                       fill="solid"
                       style="margin-bottom: 10px;"
                       label-placement="floating"
                       type="text"
                       inputmode="numeric"
                       pattern="[0-9]*"
                       @input="filterNonNumeric"
                       :label="$t('products.manage.barcode_name_label')"
            />
            <label>
              <input type="checkbox" :value="true" v-model="noBarcode">
              {{ $t('products.manage.no_barcode_label') }}
            </label>
            <ValidationTextError :show="missingRequiredFields.includes('barcode')"/>
          </div>

          <div class="input-wrapper">
            <ion-select
                :label="$t('products.manage.sector_name_label')"
                v-model="productFormData.sector_id"
                class="input-custom"
                fill="solid"
                label-placement="floating"
                placeholder="Selecciona un sector">
              <ion-select-option v-for="sector in companySectors" :value="sector.id">
                {{ sector.name }}
              </ion-select-option>
            </ion-select>
            <ValidationTextError :show="missingRequiredFields.includes('sector_id')"/>
          </div>

          <div class="input-wrapper">
            <TranslatableTextArea :label="$t('products.manage.description_label')"
                                  v-model="productFormData.description"
                                  v-if="productFetched || !productId"/>
            <ValidationTextError :show="missingRequiredFields.includes('description')"/>
<!--                                 :error-message="$t('validations.multilang_required')"/>-->
          </div>

          <div class="input-wrapper">
            <h4>{{ $t('products.manage.features_label') }}</h4>
            <div style="margin: 0.75rem 0;">
              <ion-input class="input-custom"
                         :readonly="true"
                         @mousedown="openProductCategorySelectorModal"
                         fill="solid"
                         label-placement="floating"
                         :value="productCategories.find((productCategory) => productCategory.id===productFormData.product_category_id)?.name"
                         :label="$t('products.manage.product_category_name_label')"
              />
              <ValidationTextError :show="missingRequiredFields.includes('product_category_id')"/>
            </div>

            <div v-for="feature in productFeatures" :key="feature.key">
              <label>
                <input
                    type="checkbox"
                    :value="true"
                    v-model="productFormData.features[feature.key]"
                />
                {{ feature.label }}
              </label>
            </div>
          </div>

          <div v-if="productFormData.sector_id">

            <div class="location-title">
              <ion-icon :icon="locationSharp"></ion-icon>
              <label v-show="selectedSector?.raw_type==='producer'">
                {{ $t('products.manage.producer_product_location') }}
              </label>
              <label v-show="selectedSector?.raw_type==='processor'">
                {{ $t('products.manage.processor_product_location') }}
              </label>
            </div>

            <div v-if="selectedSector?.raw_type==='processor'">
              <div class="alert-danger" v-show="edificacions.length===0">
                <span>{{ $t('products.alert_messages.no_obradors') }}</span>
                <ion-button @click="gotObradors" size="small" color="primary" shape="round" fill="outline">
                  {{ $t('products.alert_messages.no_obradors_btn') }}
                </ion-button>
              </div>

              <div class="input-wrapper" v-if="selectedSector?.raw_type==='processor'">
                <ion-select
                    v-if="edificacions.length>0"
                    :label="$t('products.manage.processor_product_location_select')"
                    v-model="productFormData.edificacio_id"
                    class="input-custom"
                    fill="solid"
                    label-placement="floating"
                >
                  <ion-select-option v-for="edificacio in edificacions" :value="edificacio.id">
                    {{ edificacio.name }}
                  </ion-select-option>
                </ion-select>
                <ValidationTextError :show="missingRequiredFields.includes('location')"/>
              </div>
            </div>

            <div v-if="selectedSector?.raw_type==='producer'"
                 style="margin-bottom: 1.5rem;"
                class="sc-ion-input-md-h sc-ion-input-md-s md input-fill-outline has-value input-label-placement-">
              <label class="input-wrapper sc-ion-input-md" style="margin-bottom: 0;">
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
                      v-model="productFormData.formatted_address"
                      :placeholder="$t('products.manage.producer_product_location_placeholder')"
                      types="geocode"
                      v-on:placechanged="setAddress"
                      classname="native-input sc-ion-input-md"/>
                </div>
              </label>
              <ValidationTextError :show="missingRequiredFields.includes('location')"/>
            </div>


            <h4>{{ $t('products.manage.ingredients') }}</h4>
            <p>{{ $t('products.manage.ingredients_info') }}</p>

            <div
                class="ingredients-bg"
                v-for="(ingredient, ingredientKey) in productFormData.ingredients.filter((ingredient) => !ingredient.parent_id)"
                :key="ingredientKey">


              <ion-item :detail="true" @click="editIngredient(ingredientKey)" class="cursor-pointer">
                <ion-label>
                  <h3>{{ Translation.translatableProperty(ingredient.name_translations) }}</h3>
                  <p>{{ availablePercentages.find((option) => option.percentage == ingredient.percentage).label }}</p>
                </ion-label>
              </ion-item>

              <div v-for="(subingredient, subingredientKey) in ingredient.subingredients" :key="subingredientKey"
                   class="subingredients">
                <ion-item :detail="true" @click="editSubingredient(ingredientKey, subingredientKey)"
                          class="cursor-pointer">
                  <ion-label>
                    <h3>- {{ Translation.translatableProperty(subingredient.name_translations) }}</h3>
                    <p>{{
                        availablePercentages.find((option) => option.percentage == subingredient.percentage).label
                      }}</p>
                  </ion-label>
                </ion-item>
              </div>

              <div class="subingredient-btn-wrapper">
                <ion-button type="button" size="small" fill="outline" @click="addSubingredient(ingredientKey)"
                            shape="round">
                  <ion-icon slot="start" :icon="add"></ion-icon>
                  {{ $t('products.manage.subingredient_add_btn') }}
                </ion-button>
              </div>
            </div>

            <ion-button type="button" fill="outline" @click="addIngredient" style="margin: 0.75rem 0 1rem 0;" size="small"
                        shape="round">
              <ion-icon slot="start" :icon="add"></ion-icon>
              {{ $t('products.manage.ingredient_add_btn') }}
            </ion-button>
            <ValidationTextError :show="missingRequiredFields.includes('ingredients')"/>

            <br>
            <div style="margin-bottom: 1rem;"></div>

          </div>


          <ion-button color="medium" :router-link="Translation.i18nRoute({name: 'products'})" shape="round">
            {{ $t('global.cancel_btn') }}
          </ion-button>

          <ion-button type="submit" size="default" :disabled="savingForm || !mediaIsReadyToSubmit" shape="round">
            {{ $t('products.manage.save_btn') }}
          </ion-button>
        </form>

        <div style="display: flex;justify-content: right;margin-top: 20px;" v-show="productId">
          <ion-button type="button" size="small" fill="clear" color="danger"
                      @click="askDeleteConfirmation">
            <ion-icon slot="start" :icon="trashBin"></ion-icon>
            {{ $t('products.manage.delete_btn') }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  </main-layout>
</template>

<script setup>
import {
  alertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import VueGoogleAutocomplete from "vue-google-autocomplete";
import {computed, nextTick, onBeforeMount, ref, watch} from 'vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {useRoute, useRouter} from "vue-router";
import SharedMethods from "@/shared/SharedMethods.js";
import {add, informationCircleOutline, locationSharp, trashBin} from "ionicons/icons";
import ProductFormValidation from "@/products/ProductFormValidation.js";
import ModalIngredient from "@/views/components/ModalIngredient.vue";
import ModalProductCategorySelector from "@/views/components/ModalProductCategorySelector.vue";
import Ingredients from "@/products/Ingredients.js";
import MainLayout from "@/layouts/MainLayout.vue";
import Translation from "@/i18n/translation.js";
import TranslatableInput from "@/views/components/TranslatableInput.vue";

import {MediaLibraryCollection} from "root/resources/js/media-library-pro-vue3-collection"
import {APISettings} from "@/api/config.js";
import {useI18n} from "vue-i18n";
import TranslatableTextArea from "@/views/components/TranslatableTextArea.vue";
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const {t} = useI18n();

const autocomplete = ref(null);
const productFetched = ref(false);
const mediaIsReadyToSubmit = ref(true);
const media = ref({});
const initialMedia = ref({});
const onMediaChange = (changedMedia) => media.value = changedMedia;

const productFeatures = [
  {key: 'vegan', label: t('products.manage.features.vegan_label')},
  {key: 'vegetarian', label: t('products.manage.features.vegetarian_label')},
  {key: 'gluten_free', label: t('products.manage.features.gluten_free_label')},
  {key: 'organic', label: t('products.manage.features.organic_label')},
  {key: 'biodynamic', label: t('products.manage.features.biodynamic_label')},
  {key: 'fair_trade', label: t('products.manage.features.fair_trade_label')},
];

const route = useRoute();
const router = useRouter();
const productId = route.params.productId ?? null;
const product = ref(null);
const edificacions = ref([]);
const savingForm = ref(false);
const companySectors = ref([]);
const companyBrands = ref([]);
const productCategories = ref([]);
const missingRequiredFields = ref([]);
const productFormData = ref({
  name: null,
  format: null,
  description: null,
  barcode: null,
  sector_id: null,
  product_category_id: null,
  edificacio_id: null,
  address_components: null,
  formatted_address: null,
  latitude: null,
  longitude: null,
  ingredients: [],
  features: {},
});
const noBarcode = ref(false);

watch(noBarcode, (newValue) => {
  if (newValue === true) {
    productFormData.value.barcode = '';
  }
});

const filterNonNumeric = (event) => {
  if (event.target.value) {
    // Replace any non-numeric character with an empty string
    const numericValue = event.target.value.replace(/\D/g, '');
    // Only update if the value has changed (to avoid cursor jumping)
    if (numericValue !== event.target.value) {
      productFormData.value.barcode = numericValue;
    }
  }
};


const availablePercentages = [
  {label: '0.001% - 5%', percentage: 2.5},
  {label: '5.001% - 20%', percentage: 12.5},
  {label: '20.001% - 40%', percentage: 30},
  {label: '40.001% - 60%', percentage: 50},
  {label: '60.001% - 80%', percentage: 70},
  {label: '80.001% - 100%', percentage: 90},
];

const askDeleteConfirmation = async () => {
  const alertButtons = [
    {
      text: t('products.delete_confirmation.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('products.delete_confirmation.confirm_btn'),
      role: 'confirm',
      handler: () => deleteProducte(),
    },
  ];

  const alert = await alertController.create({
    header: t('products.delete_confirmation.header'),
    message: t('products.delete_confirmation.message_current_product', {product: product.name}),
    buttons: alertButtons,
  });
  await alert.present();
}

const deleteProducte = async () => {
  TraceabilityApiMethods
      .deleteProduct(productId)
      .then(() => SharedMethods.showSuccessfulToast(t('products.alert_messages.product_deleted')))
      .then(() => {
        setTimeout(function () {
          const route = Translation.i18nRoute({name: 'products'});
          router.push(route);
        }, 2000);
      })
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });
}

const setAddress = (addressData, placeResultData) => {
  productFormData.value.address_components = placeResultData.address_components;
  productFormData.value.formatted_address = placeResultData.formatted_address;
  productFormData.value.latitude = addressData.latitude;
  productFormData.value.longitude = addressData.longitude;
  productFormData.value.edificacio_id = null;
};

const gotObradors = () => router.push(Translation.i18nRoute({name: 'profile'}))

const openIngredientModal = async (
    indexKey,
    parentIndexKey,
    name,
    percentage,
    unknown_location,
    formatted_address,
    address_components,
    latitude,
    longitude,
) => {
  const modal = await modalController.create({
    component: ModalIngredient,
    componentProps: {
      availablePercentages: availablePercentages,
      indexKey: indexKey,
      parentIndexKey: parentIndexKey,
      name: name,
      percentage: percentage,
      locationEnabled: (selectedSector.value.raw_type === 'processor' && (parentIndexKey == null)),
      unknown_location: unknown_location,
      formatted_address: formatted_address,
      address_components: address_components,
      latitude: latitude,
      longitude: longitude,
    }
  });

  await modal.present();
  const response = await modal.onWillDismiss();
  const roleHandlers = {
    'create': Ingredients.handleCreation,
    'update': Ingredients.handleUpdate,
    'delete': Ingredients.handleDeletion
  };

  const handlerFunction = roleHandlers[response.role];
  if (handlerFunction) {
    productFormData.value = await handlerFunction(productFormData.value, response.data);
  }
}

const addIngredient = async () => await openIngredientModal(null, null, null, null, false, null, null, null, null)

const editIngredient = async (ingredientKey) => {
  await openIngredientModal(
      ingredientKey,
      null,
      productFormData.value.ingredients[ingredientKey].name_translations,
      productFormData.value.ingredients[ingredientKey].percentage,
      productFormData.value.ingredients[ingredientKey].unknown_location,
      productFormData.value.ingredients[ingredientKey].formatted_address,
      productFormData.value.ingredients[ingredientKey].address_components,
      productFormData.value.ingredients[ingredientKey].latitude,
      productFormData.value.ingredients[ingredientKey].longitude,
  );
}

const addSubingredient = async (parentIndexKey) => await openIngredientModal(null, parentIndexKey, null, null, false, null, null, null, null);

const editSubingredient = async (parentIndexKey, ingredientIndexKey) => {
  await openIngredientModal(
      ingredientIndexKey,
      parentIndexKey,
      productFormData.value.ingredients[parentIndexKey].subingredients[ingredientIndexKey].name_translations,
      productFormData.value.ingredients[parentIndexKey].subingredients[ingredientIndexKey].percentage,
      productFormData.value.ingredients[parentIndexKey].subingredients[ingredientIndexKey].unknown_location,
      productFormData.value.ingredients[parentIndexKey].subingredients[ingredientIndexKey].formatted_address,
      productFormData.value.ingredients[parentIndexKey].subingredients[ingredientIndexKey].address_components,
      productFormData.value.ingredients[parentIndexKey].subingredients[ingredientIndexKey].latitude,
      productFormData.value.ingredients[parentIndexKey].subingredients[ingredientIndexKey].longitude,
  );
}

const openProductCategorySelectorModal = async () => {
  const modal = await modalController.create({
    component: ModalProductCategorySelector,
    componentProps: {
      productCategories: productCategories.value,
      initialSubcategory: productFormData.value.product_category_id
    }
  });

  await modal.present();
  const response = await modal.onWillDismiss();
  if (response.role === 'confirm') {
    productFormData.value.product_category_id = response.data.selectedCategory;
  }
}

const fetchCompanySectorsAndBrands = async () => {
  return TraceabilityApiMethods.fetchCompany().then(function (companyData) {
    companyBrands.value = companyData.brands;
    companySectors.value = companyData.sectors;
  });
}
const fetchProductCategories = async () => TraceabilityApiMethods.fetchProductCategories().then((list) => productCategories.value = list);

const fetchObradors = async () => {
  TraceabilityApiMethods.fetchObradors().then((response) => edificacions.value = response);
}

const fetchProduct = async () => {
  TraceabilityApiMethods.fetchProduct(productId)
      .then(data => product.value = data)
      .then(function (data) {
        initialMedia.value = data.media;
        media.value = data.media;
        productFormData.value.name = data.name_translations;
        productFormData.value.format = data.format_translations;
        productFormData.value.description = data.description_translations;
        productFormData.value.features = data.features ?? {};
        productFormData.value.sector_id = data.sector_id;
        productFormData.value.product_category_id = data.product_category_id;
        productFormData.value.brand_id = data.brand_id;
        productFormData.value.edificacio_id = data.edificacio_id;
        productFormData.value.address_components = data.address_components;
        productFormData.value.formatted_address = data.formatted_address;
        productFormData.value.latitude = data.latitude;
        productFormData.value.longitude = data.longitude;
        productFormData.value.barcode = data.barcode;
        noBarcode.value = data.no_barcode ? true : false;
        productFormData.value.ingredients = data.ingredients.map(function (ingredient) {
          ingredient.subingredients = data.subingredients.filter((subingredient) => subingredient.parent_id === ingredient.id);
          return ingredient;
        });
        productFetched.value = true;

        nextTick(() => {
          if (productFormData.value.formatted_address && autocomplete.value) {
            autocomplete.value.$el.value = productFormData.value.formatted_address;
          }
        });
      })
}

const submitFormProduct = () => {
  const hasMedia = Object.keys(media.value).length > 0;
  missingRequiredFields.value = [];

  // Validate data
  const formData = {
    name: productFormData.value.name,
    format: productFormData.value.format,
    description: productFormData.value.description,
    features: productFormData.value.features,
    sector_id: productFormData.value.sector_id,
    product_category_id: productFormData.value.product_category_id,
    brand_id: productFormData.value.brand_id,
    edificacio_id: productFormData.value.edificacio_id,
    address_components: productFormData.value.address_components,
    formatted_address: productFormData.value.formatted_address,
    latitude: productFormData.value.latitude,
    longitude: productFormData.value.longitude,
    barcode: productFormData.value.barcode,
    no_barcode: noBarcode.value,
    media: media.value,
    ingredients: productFormData.value.ingredients.map(function (ingredient) {
      ingredient.name = ingredient.name_translations;
      ingredient.subingredients = ingredient.subingredients.map(function (subingredient) {
        subingredient.name = subingredient.name_translations;
        return subingredient;
      })
      return ingredient;
    }),
  };

  if (!SharedMethods.isValidMultilangField(formData.name)) {
    missingRequiredFields.value.push('name');
  }

  if (!SharedMethods.isValidMultilangField(formData.format)) {
    missingRequiredFields.value.push('format');
  }

  if (!formData.brand_id) {
    missingRequiredFields.value.push('brand_id');
  }

  if (
      !formData.no_barcode
      && (!formData.barcode || formData.barcode.length === 0)) {
    missingRequiredFields.value.push('barcode');
  }

  // Validate that barcode contains only numbers
  if (!formData.no_barcode && formData.barcode && !/^\d+$/.test(formData.barcode)) {
    missingRequiredFields.value.push('barcode');
    SharedMethods.showErrorToast(t('products.alert_messages.barcode_must_be_numeric'));
  }

  if (!formData.sector_id) {
    missingRequiredFields.value.push('sector_id');
  }

  if (!formData.product_category_id) {
    missingRequiredFields.value.push('product_category_id');
  }

  if (!SharedMethods.isValidMultilangField(formData.description)) {
    missingRequiredFields.value.push('description');
  }

  if (!hasMedia) {
    missingRequiredFields.value.push('media');
  }

  if (selectedSector.value) {
    if (selectedSector?.value.raw_type === 'processor' && !formData.edificacio_id) {
      missingRequiredFields.value.push('location');
    }
    if (selectedSector?.value.raw_type === 'producer' && (!formData.formatted_address || !formData.latitude)) {
      missingRequiredFields.value.push('location');
    }
  }

  if (
      !ProductFormValidation.allIngredientsFieldsAreFilled(formData.ingredients)
      || formData.ingredients.length === 0
  ) {
    missingRequiredFields.value.push('ingredients');
  }
  if (missingRequiredFields.value.length > 0) {
    SharedMethods.showErrorToast(t('products.alert_messages.invalid_form_saved'), 300);
    return;
  }

  savingForm.value = true;

  // Persist changes
  const saveProductResponse = (productId)
      ? updateProduct(formData)
      : createProduct(formData);

  saveProductResponse
      .then((productResponse) => {
        setTimeout(() => {
          const route = Translation.i18nRoute({
            name: 'product-evaluation',
            params: {
              productId: productResponse.id,
            }
          });
          router.push(route);
        }, 1500);
      })
      .catch(function (error) {
        SharedMethods.showErrorToast(error);
        savingForm.value = false;
      });
}

const updateProduct = (formData) => {
  return TraceabilityApiMethods.updateProduct(productId, formData)
      .then((response) => {
        SharedMethods.showSuccessfulToast(t('global.alert_messages.saved'));
        return response;
      })
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });
}

const createProduct = (formData) => {
  return TraceabilityApiMethods.createProduct(formData)
      .then((response) => {
        SharedMethods.showSuccessfulToast(t('products.alert_messages.product_created'));
        return response;
      })
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });
};

const selectedSector = computed(() => {
  return companySectors.value.find((sector) => sector.id === productFormData.value.sector_id);
});

onBeforeMount(() => {
  fetchCompanySectorsAndBrands();
  fetchProductCategories();
  fetchObradors();
  if (productId) {
    fetchProduct();
  }
});

</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}

.subingredients {
  padding-left: 2rem;
}

.subingredients ion-item {
  font-size: 0.9rem;
}

.subingredient-btn-wrapper {
  display: flex;
  justify-content: end;
  padding: 10px 30px 10px;
}

.input-wrapper {
  margin-bottom: 1.5rem;
}

.ingredients-bg {
  background: #fff;
  --ion-background-color: #fff;
  --ion-item-background: #fff;
}

.help-text-wrapper {
  display: flex;
  align-items: center;
  margin-top: 0.4rem;
  gap: 0.3rem;
}

.location-title {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.alert-danger {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

</style>
