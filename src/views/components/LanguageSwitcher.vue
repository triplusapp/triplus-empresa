<template>
  <div class="select-wrapper">
    <ion-select
        aria-label="Idioma"
        v-model="currentLocale"
        @ionChange="switchLanguage"
        interface="popover"
    >
      <ion-select-option
          v-for="sLocale in supportedLocales"
          :key="`locale-${sLocale}`"
          :value="sLocale"
      >
        {{ $t(`locale.${sLocale}`) }}
      </ion-select-option>
    </ion-select>
  </div>
</template>
<script setup>
import {
  IonSelect,
  IonSelectOption,
} from '@ionic/vue';
import Translation from "@/i18n/translation.js";
import {useRouter} from "vue-router";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {useUserStore} from "@/store/user.store.js";

const router = useRouter();
const currentLocale = Translation.currentLocale;
const supportedLocales = Translation.supportedLocales
const userStore = useUserStore();

const switchLanguage = async (event) => {
  const newLocale = event.target.value
  await Translation.switchLanguage(newLocale)

  try {
    await router.replace({params: {locale: newLocale}});
    if (userStore.isLoggedIn) {
      await TraceabilityApiMethods.updateUserLocale(newLocale);
    }
  } catch (e) {
    router.push('/');
  }
}
</script>
<style scoped>
.select-wrapper {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.select-wrapper label {
  margin-right: 5px;
}
</style>
