<template>
  <main-layout>
    <ion-header >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t('settings.page_title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">

      <div v-if="mainUser">
        <h4>{{ $t('settings.users.title') }}</h4>
        <p>{{ $t('settings.users.intro') }}</p>
        <CompanyUsersList/>
      </div>

      <h4>{{ $t('settings.account.title') }}</h4>
      <p>{{ $t('settings.account.intro') }}</p>
      <div class="account-wrapper">
        <UpdateEmailForm/>

        <UpdatePasswordForm/>
      </div>

      <DeleteAccount v-if="mainUser"/>

    </ion-content>
  </main-layout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar} from '@ionic/vue';
import CompanyUsersList from "@/views/components/company-users/CompanyUsersList.vue";
import DeleteAccount from "@/views/components/user/DeleteAccount.vue";
import UpdateEmailForm from "@/views/components/user/UpdateEmailForm.vue";
import UpdatePasswordForm from "@/views/components/user/UpdatePasswordForm.vue";
import {useUserStore} from "@/store/user.store.js";
import {computed} from "vue";

const userStore = useUserStore();
const mainUser = computed(() => userStore.user.isMainUser);

</script>

<style scoped>
.account-wrapper {
  display: grid;
  grid-gap: 3rem;
  grid-template-columns: 1fr 1fr;
}
</style>
