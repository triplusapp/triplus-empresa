<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Empresa</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">

        <div v-if="indicators.length>0">
          <div class="intro-evaluation-page" v-html="$t('company.intro')"></div>
        </div>

        <indicators-list
            v-if="indicators.length>0"
            :indicators="indicators"
            :evaluable-model-id="evaluableModelId"
            evaluable-model-type="company"
        />

      </div>
    </ion-content>
  </main-layout>
</template>

<script setup>
import {useUserStore} from "@/store/user.store.js";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar} from '@ionic/vue';
import {onMounted, ref} from 'vue';
import IndicatorsList from "@/views/components/IndicatorsList.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import MainLayout from "@/layouts/MainLayout.vue";
import SharedMethods from "@/shared/SharedMethods.js";

const userStore = useUserStore();
let evaluableModelId = userStore.company.id;

const indicators = ref([]);

const fetchCompanyIndicators = async () => {
  const loadingPage = await SharedMethods.showLoadingPage();
  TraceabilityApiMethods.fetchCompanyIndicators()
      .then(data => indicators.value = data)
      .finally(() => loadingPage.dismiss());
}

onMounted(() => fetchCompanyIndicators());
</script>

<style scoped>
.info-company-workers {
  line-height: 1.3rem;
  font-size: 0.9rem;
}

.info-company-workers ul {
  margin-bottom: 30px;
}

.info-company-workers li {
  margin-bottom: 10px;
}
</style>
