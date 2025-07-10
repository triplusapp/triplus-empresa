<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t('evaluation_date.page_title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
    </ion-content>
  </main-layout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  modalController
} from '@ionic/vue';
import {onMounted} from "vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import ModalSetEvaluationDate from "@/views/components/evaluation-status/ModalSetEvaluationDate.vue";
import {useRouter} from "vue-router";
import SharedMethods from "@/shared/SharedMethods.js";
import {useI18n} from "vue-i18n";

const router = useRouter();
const {t} = useI18n();

const openEvaluationDateModal = async () => {
  const modal = await modalController.create({
    component: ModalSetEvaluationDate,
  });

  await modal.present();
  const response = await modal.onWillDismiss();

  if (response.role === 'saved') {
    SharedMethods.showSuccessfulToast(t('evaluation_date.alert_messages.date_updated'));
  }

  await router.push('/');
}

onMounted(async () => {
  TraceabilityApiMethods.fetchCompany()
      .then((companyData) => {
        if (!companyData.evaluations_open_at) {
          openEvaluationDateModal();
        }
      });
});

</script>

<style scoped>

</style>
