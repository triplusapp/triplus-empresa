<template>
  <div class="translatable-input">
    <ion-input v-model="textByLanguage[selectedLanguage]"
               class="input-custom"
               fill="solid"
               label-placement="floating"
               :label="label"
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
import {IonInput, IonSelect, IonSelectOption,} from '@ionic/vue';
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
