<template>
  <guest-layout>
    <div id="container">
      <div class="language-selector">
        <LanguageSwitcher/>
      </div>
      <div class="content">
        <div id="not-logged-in">
          <img src="/assets/logo-h.svg" alt="logo" class="logo">
          <div>
            <ion-button :router-link="Translation.i18nRoute({ name: 'login' })" size="default">
              {{ $t('home.auth.login') }}
            </ion-button>
          </div>
          <br>
          <div>
            <ion-button fill="clear" :router-link="Translation.i18nRoute({ name: 'register' })">
              {{ $t('home.auth.register') }}
            </ion-button>
          </div>
        </div>
      </div>

      <home-footer/>
    </div>
  </guest-layout>
</template>

<script setup>
import {IonButton} from '@ionic/vue';
import GuestLayout from "@/layouts/GuestLayout.vue";
import HomeFooter from "@/views/components/HomeFooter.vue";
import LanguageSwitcher from "@/views/components/LanguageSwitcher.vue";
import Translation from "@/i18n/translation.js";
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#container .content {
  flex: 1;
  display: flex;
  justify-content: center;
}

#container a {
  text-decoration: none;
}

#not-logged-in {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.language-selector {
  position: absolute;
  top: 20px;
  right: 20px;
}

.logo {
  width: 100px;
  margin-bottom: 50px;
}
</style>
