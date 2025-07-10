<template>
  <div>

    <div class="card-subheader">{{ $t('profile.public.intro') }}</div>
    <div class="card-body">
      <div>
        <label>{{ $t('profile.public.legal_name') }}</label>
        <div class="value">{{ companyFormData.legal_name ?? '-' }}</div>
      </div>

      <div>
        <label>{{ $t('profile.public.name') }}</label>
        <div class="value">{{ companyFormData.name ?? '-' }}</div>
      </div>

      <div>
        <label>{{ $t('profile.public.address') }}</label>
        <div class="value">{{ companyFormData.address ?? '-' }}</div>
      </div>

      <div>
        <label>{{ $t('profile.public.description') }}</label>
        <div class="value">{{ companyFormData.description[currentLocale] ?? '-' }}</div>
      </div>

      <div>
        <label>{{ $t('profile.public.brands_title') }}</label>
        <div class="value">{{ companyFormData.brands.map(item => item.name).join(', ') }}</div>
      </div>

      <div class="media">
        <img v-for="media in initialMedia" :src="media.preview_url"/>
      </div>
    </div>
  </div>

</template>

<script setup>
import {defineProps} from "vue";
import Translation from "@/i18n/translation.js";

const currentLocale = Translation.currentLocale;

const props = defineProps({
  initialMedia: Object,
  companyFormData: Object,
});

const initialMedia = props.initialMedia;
const companyFormData = props.companyFormData;

</script>

<style scoped>
.media {
  justify-content: center;
  margin-top: calc(var(--ion-padding) * 2);
  display: flex;
  flex-wrap: wrap;
  gap: var(--ion-padding);
}

.media img {
  max-height: 100px;
}
</style>
