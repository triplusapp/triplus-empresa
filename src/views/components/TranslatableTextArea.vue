<template>
  <div class="translatable-input">

    <ion-textarea
        class="input-custom"
        fill="solid"
        label-placement="floating"
        v-model="textByLanguage[selectedLanguage]"
        :auto-grow="true"
        :label="label"
        rows="6"
        :placeholder="placeholder"/>

    <div class="locale-dropdown">
      <ion-select v-model="selectedLanguage" interface="popover">
        <ion-select-option
            v-for="sLocale in supportedLocales"
            :key="`locale-${sLocale}`"
            :value="sLocale"
            v-model="selectedLanguage"
        >
          {{ $t(`locale.${sLocale}`) }}
        </ion-select-option>
      </ion-select>
    </div>
  </div>
</template>

<script setup>
import {IonSelect, IonSelectOption,IonTextarea} from '@ionic/vue';
import {defineEmits, defineProps, ref, watchEffect} from 'vue';
import Translation from "@/i18n/translation.js";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: Object
});

const currentLocale = Translation.currentLocale;
const supportedLocales = Translation.supportedLocales
const textByLanguage = ref(Object.assign({}, props.modelValue));
const selectedLanguage = ref(currentLocale);

watchEffect(() => {
  emit('update:modelValue', textByLanguage.value);
});
</script>

<style scoped>
.translatable-input {
  display: flex;
}

.locale-dropdown {
  margin-left: 15px;
}
</style>
