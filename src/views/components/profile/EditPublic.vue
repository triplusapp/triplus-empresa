<template>
  <form @submit.prevent="submitFormCompany">

    <div class="flex" style="display: flex;gap: 1.5rem;">
      <div class="input-wrapper" style="flex: 1;">
        <ion-input v-model="companyFormData.legal_name"
                   class="input-custom"
                   fill="solid"
                   label-placement="floating"
                   :label="$t('profile.public.legal_name')"
                   :placeholder="$t('profile.public.placeholder_txt')"/>
        <ValidationTextError :show="missingFields.legal_name" />
      </div>

      <div class="input-wrapper" style="flex: 1;">
        <ion-input v-model="companyFormData.name"
                   class="input-custom"
                   fill="solid"
                   label-placement="floating"
                   :label="$t('profile.public.name')"
                   :placeholder="$t('profile.public.placeholder_txt')"/>
        <ValidationTextError :show="missingFields.name" />
      </div>
    </div>

    <div class="input-wrapper">
      <ion-input v-model="companyFormData.address"
                 class="input-custom"
                 fill="solid"
                 label-placement="floating"
                 :label="$t('profile.public.address')"
                 :placeholder="$t('profile.public.placeholder_txt')"/>
      <ValidationTextError :show="missingFields.address" />
    </div>

    <div class="input-wrapper">
      <TranslatableTextArea
          :label="$t('profile.public.description')"
          :placeholder="$t('profile.public.placeholder_txt')"
          v-model="companyFormData.description"/>
      <ValidationTextError :show="missingFields.description"/>
      <!--      <ValidationTextError :show="missingFields.description" :error-message="t('validations.multilang_required')"/>-->
    </div>

    <media-library-collection
        :upload-domain="APISettings.baseURL"
        name="media"
        :validation-rules="{ accept: ['image/png', 'image/jpeg'], maxSizeInKB: 1024*5 }"
        :translations="$tm('media-library')"
        @is-ready-to-submit-change="mediaIsReadyToSubmit = $event"
        @change="onMediaChange"
        :initial-value="initialMedia"
        :max-items="5"
    />
    <ValidationTextError :show="missingFields.media" />

    <h3>{{ $t('profile.public.brands_title') }}</h3>
    <ValidationTextError :show="missingFields.brands" :error-message="t('profile.public.alert_messages.missing_brand')" />
    <div v-for="(brand, index) in companyFormData.brands" :key="index">
      <div v-show="!brand.deleted" class="brand">
        <ion-input v-model="companyFormData.brands[index].name"
                   class="input-custom"
                   fill="solid"
                   label-placement="floating"
                   :label="$t('profile.public.brand_name')"
                   :placeholder="$t('profile.public.placeholder_txt')"/>

        <ion-button type="button" size="small" fill="clear" color="danger" @click="removeBrand(index)">
          <ion-icon slot="start" :icon="trashBin"></ion-icon>
        </ion-button>
      </div>
    </div>

    <div>
      <ion-button @click="addBrand" type="button" size="small" fill="outline" shape="round" style="margin-top: 1rem;">
        <ion-icon slot="start" :icon="add"></ion-icon>
        {{ $t('profile.public.add_brand_btn') }}
      </ion-button>
    </div>

    <br>

    <ion-button color="medium" @click="cancelEditing" shape="round">
      {{ $t('global.cancel_btn') }}
    </ion-button>

    <ion-button type="submit" size="default" shape="round">
      {{ $t('global.save_btn') }}
    </ion-button>

  </form>
</template>

<script setup>
import {defineProps, ref} from "vue";
import {IonButton, IonInput, IonIcon} from '@ionic/vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import {APISettings} from "@/api/config.js";
import {MediaLibraryCollection} from "root/resources/js/media-library-pro-vue3-collection/dist/index.js";
import TranslatableTextArea from "@/views/components/TranslatableTextArea.vue";
import {useI18n} from "vue-i18n";
import {add, trashBin} from "ionicons/icons";
import ValidationTextError from "@/views/components/ValidationTextError.vue";

const {t} = useI18n();

const props = defineProps({
  initialMedia: Object,
  companyFormData: Object,
});

const initialMedia = props.initialMedia;
const companyFormData = props.companyFormData;

const mediaIsReadyToSubmit = ref(true);
const media = ref({});
media.value = initialMedia;
const onMediaChange = (changedMedia) => media.value = changedMedia;

const missingFields = ref({
  legal_name: false,
  name: false,
  address: false,
  description: false,
  brands: false,
  media: false
});
const addBrand = () => {
  companyFormData.brands.push({ name: '', id: null, deleted: false });
};

const removeBrand = (index) => {
  companyFormData.brands[index].deleted = true;
};

const submitFormCompany = async () => {
  // Validate data
  const formData = {
    name: companyFormData.name,
    legal_name: companyFormData.legal_name,
    address: companyFormData.address,
    description: companyFormData.description,
    media: media.value,
    brands: companyFormData.brands.filter((brand) => !brand.deleted).filter((brand) => brand.name.length>0)
  };

  missingFields.value.legal_name = (!formData.legal_name);
  missingFields.value.name = (!formData.name);
  missingFields.value.address = (!formData.address);
  missingFields.value.description = !SharedMethods.isValidMultilangField(formData.description);
  missingFields.value.brands = formData.brands.length===0;
  missingFields.value.media = Object.keys(formData.media).length === 0;
  if (
      missingFields.value.legal_name
      || missingFields.value.name
      || missingFields.value.address
      || missingFields.value.description
      || missingFields.value.brands
      || missingFields.value.media
  ) {
    SharedMethods.showErrorToast(t('validations.missing_fields'));
    return;
  }

  // Update
  TraceabilityApiMethods.updateCompanyPublicData(formData)
      .then(() => SharedMethods.showSuccessfulToast(t('global.alert_messages.saved')))
      .then(() => window.location.reload())
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });
}

const emit = defineEmits(['cancel-editing']);
const cancelEditing = () => emit('cancel-editing');
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}
.brand{
  display: flex;
  align-items: center;
}
</style>
