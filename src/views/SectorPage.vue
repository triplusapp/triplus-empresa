<template>
  <main-layout>
    <ion-header >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Sector: {{ sector?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">

        <indicators-list
            v-if="indicators.length>0"
            :indicators="indicators"
            :evaluable-model-id="sector.id"
            evaluable-model-type="sector"
        />

      </div>
    </ion-content>
  </main-layout>
</template>

<script setup>
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/vue';

const route = useRoute();
const sector = ref(null);

import {onBeforeMount, ref} from 'vue';
import IndicatorsList from "@/views/components/IndicatorsList.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {useRoute} from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import SharedMethods from "@/shared/SharedMethods.js";

const indicators = ref([]);
const fetchSectorIndicators = async () => {
  const loadingPage = await SharedMethods.showLoadingPage();
  TraceabilityApiMethods.fetchSectorIndicators(sector.value.id)
      .then(data => indicators.value = data)
      .finally(() => loadingPage.dismiss());
}

onBeforeMount(() => {
  TraceabilityApiMethods.fetchCompany()
      .then((companyData) => {
        sector.value = companyData.sectors.find((sector) => sector.id == route.params.sectorId)
        fetchSectorIndicators();
      });
});

</script>
