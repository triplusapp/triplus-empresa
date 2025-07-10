<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t('audit_reports.page_title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $t('audit_reports.page_title') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <p class="bold-text">{{ $t('audit_reports.intro') }}</p>

        <ion-list v-if="reports.length > 0">
          <ion-item v-for="report in reports" :key="report.id">
            <ion-label>
              <h2>{{ report.date }}. {{ report.title }}</h2>
            </ion-label>
            <ion-button color="medium" @click="downloadReport(report)" shape="round" fill="outline">
              <ion-icon slot="start" :icon="download"></ion-icon>
              {{ $t('audit_reports.download_btn') }}
            </ion-button>
          </ion-item>
        </ion-list>

        <div v-else class="ion-text-center ion-padding">
          <ion-spinner v-if="loading"></ion-spinner>
          <p v-else>{{ $t('audit_reports.no_results') }}</p>
        </div>
      </div>
    </ion-content>
  </main-layout>
</template>

<script setup>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonSpinner,
  IonTitle,
  IonIcon,
  IonToolbar,
} from '@ionic/vue';
import {onMounted, ref} from 'vue';
import TraceabilityApiMethods from '@/api/TraceabilityApiMethods.js';
import MainLayout from "@/layouts/MainLayout.vue";
import {download} from "ionicons/icons";
import SharedMethods from "@/shared/SharedMethods.js";
import {useI18n} from "vue-i18n";

const reports = ref([]);
const loading = ref(true);
const {t} = useI18n();

onMounted(async () => {
  try {
    reports.value = await TraceabilityApiMethods.fetchCompanyAuditReports();
  } catch (error) {
    console.error('Error fetching audit reports:', error);
  } finally {
    loading.value = false;
  }
});

const downloadReport = async (file) => {
  TraceabilityApiMethods.downloadCompanyAuditReport(file.id)
      .then((blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', file.filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch(message => SharedMethods.showErrorToast(t('profile.auditories.alert_messages.file_download_error')))
}

</script>

<style scoped>
.bold-text {
  font-weight: bold;
}
</style>
