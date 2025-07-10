<template>
  <main-layout>

    <ion-content :fullscreen="true">
      <div id="container">
        <div class="content">
          <div id="logged-in" v-if="userStore.isLoggedIn">
            <div class="greeting">
              <strong>Hola</strong>, {{ userStore.user.name }}
            </div>
            <br><br>
            <div @click="logout" class="link">{{ $t('home.auth.logout') }}</div>
          </div>
        </div>

        <home-footer/>
      </div>

    </ion-content>
  </main-layout>
</template>

<script setup>
import {IonContent} from '@ionic/vue';
import {useUserStore} from "@/store/user.store.js";
import MainLayout from "@/layouts/MainLayout.vue";
import HomeFooter from "@/views/components/HomeFooter.vue";
import EvaluationStatusBar from "@/views/components/evaluation-status/EvaluationStatusBar.vue";

const userStore = useUserStore();

const logout = async () => await userStore.logout();
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

#logged-in {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#logged-in .greeting {
  font-size: 1.5rem;
}
</style>
