<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t('legal_documents.page_title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $t('legal_documents.page_title') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <p class="bold-text">{{ $t('legal_documents.intro') }}</p>

        <ion-list v-if="documents.length > 0">
          <ion-item v-for="document in documents" :key="document.id">
            <ion-label>
              <h2 :class="{ 'bold-text': document.is_valid }">{{ document.document_name }}</h2>
              <p v-if="document.is_valid" class="valid-text">
                {{ $t('legal_documents.valid_until', {date: document.validity_date}) }}
              </p>
            </ion-label>
            <ion-button color="medium" @click="downloadDocument(document)" shape="round" fill="outline">
              <ion-icon slot="start" :icon="download"></ion-icon>
              {{ $t('legal_documents.download_btn') }}
            </ion-button>
          </ion-item>
        </ion-list>

        <div v-else class="ion-text-center ion-padding">
          <ion-spinner v-if="loading"></ion-spinner>
          <p v-else>{{ $t('legal_documents.no_results') }}</p>
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
import TraceabilityApiMethods from '@/api/TraceabilityApiMethods';
import MainLayout from "@/layouts/MainLayout.vue";
import {download} from "ionicons/icons";
import SharedMethods from "@/shared/SharedMethods.js";
import {useI18n} from "vue-i18n";

const documents = ref([]);
const loading = ref(true);
const {t} = useI18n();

onMounted(async () => {
  try {
    documents.value = await TraceabilityApiMethods.fetchCompanyLegalDocuments();
  } catch (error) {
    console.error('Error fetching legal documents:', error);
  } finally {
    loading.value = false;
  }
});

const downloadDocument = async (file) => {
  TraceabilityApiMethods.downloadCompanyLegalDocument(file.id)
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

.valid-text {
  font-size: 0.8rem;
  margin-top: 4px;
  font-weight: bold;
}
</style>
