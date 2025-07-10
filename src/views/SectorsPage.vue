<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t('sectors.page_title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="addSector" size="default" color="primary" shape="round" fill="solid">
            {{ $t('sectors.add_sector_btn') }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">

      <div class="intro-evaluation-page" v-html="$t('sectors.intro')"></div>

      <p v-if="companySectors && companySectors.length===0">
        {{ $t('sectors.alert_messages.no_sectors_added_message') }}
      </p>

      <ion-list :inset="true" v-else class="sector-list">
        <ion-item v-for="sector in companySectors">
          <div class="sector">

            <div style="flex: 1;">
              <h6 style="margin: 0;">{{ sector.name }}</h6>
              <small>{{ sector.type }}</small>
              <div>
                <small>{{ sectorInformationById[sector.id]?.num_products ?? '-' }} {{
                    $t('sectors.num_products')
                  }}</small>
              </div>
            </div>

            <div style="display: flex; gap: 20px;align-items:center;">
              <div style="text-align: center;">
                <div>
                  {{ sectorInformationById[sector.id]?.num_structural_indicators_evaluated ?? '-' }} /
                  {{ sectorInformationById[sector.id]?.num_structural_indicators ?? '-' }}
                </div>
                <small>{{ $t('sectors.estructurals') }}</small>
              </div>

              <div style="text-align: center;">
                <div>
                  {{ sectorInformationById[sector.id]?.num_complementary_indicators_evaluated ?? '-' }} /
                  {{ sectorInformationById[sector.id]?.num_complementary_indicators ?? '-' }}
                </div>
                <small>{{ $t('sectors.complementaris') }}</small>
              </div>

              <ion-button type="button" :router-link="Translation.i18nRoute({
                name: 'sector',
                params: { sectorId: sector.id}
            })" size="small" color="light" shape="round">
                {{ $t('sectors.evaluate_btn') }}
              </ion-button>

              <ion-button type="button" size="small" fill="clear" color="danger"
                          @click="askDeleteConfirmation(sector)">
                <ion-icon :icon="trashBin"></ion-icon>
              </ion-button>
            </div>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  </main-layout>
</template>

<script setup>
import {
  alertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  modalController
} from '@ionic/vue';
import {onMounted, ref} from "vue";
import SharedMethods from "@/shared/SharedMethods.js";
import MainLayout from "@/layouts/MainLayout.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import ModalCreateSector from "@/views/components/ModalCreateSector.vue";
import {trashBin} from "ionicons/icons";
import Translation from "@/i18n/translation.js";

import {useI18n} from "vue-i18n";

const {t} = useI18n();

const companySectors = ref(null);
const sectorInformationById = ref({});
const sectorList = ref([]);

const addSector = async () => await openNewSectorModal(sectorList.value)

const removeSector = async (sectorIdToRemove) => {
  let sectorsIds = companySectors.value.map((sector) => sector.id);
  const index = sectorsIds.indexOf(sectorIdToRemove);
  sectorsIds.splice(index, 1);
  saveSectors(sectorsIds);
}

const askDeleteConfirmation = async (sector) => {
  const alertButtons = [
    {
      text: t('sectors.delete_confirmation.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('sectors.delete_confirmation.confirm_btn'),
      role: 'confirm',
      handler: () => removeSector(sector.id),
    },
  ];
  const alert = await alertController.create({
    header: t('sectors.delete_confirmation.header'),
    message: t('sectors.delete_confirmation.message', {sector: sector.name}),
    buttons: alertButtons,
  });
  await alert.present();
}

const openNewSectorModal = async (sectorList) => {
  const modal = await modalController.create({
    component: ModalCreateSector,
    componentProps: {
      sectorList: sectorList,
    }
  });

  await modal.present();
  const response = await modal.onWillDismiss();

  if (response.role === 'create') {
    let sectorsIds = companySectors.value.map((sector) => sector.id);
    sectorsIds.push(response.data.sectorIdToAdd);
    saveSectors(sectorsIds);
  }
}

const saveSectors = async (sectorsIds) => {
  TraceabilityApiMethods.updateCompanySectors({'sectors_ids': sectorsIds})
      .then(() => {
        SharedMethods.showSuccessfulToast(t('global.alert_messages.saved'));
        TraceabilityApiMethods.fetchCompany().then((companyData) => companySectors.value = companyData.sectors);
      })
      .catch((errorMessage) => {
        const errorToastMessage = errorMessage === 'platform_closed'
            ? t('global.alert_messages.platform_closed')
            : errorMessage;

        SharedMethods.showErrorToast(errorToastMessage);
      });
}

const fetchEvaluationsInformation = async (sectorIds) => {
  // Fill evaluated indicators number
  TraceabilityApiMethods.fetchSectorsIndicatorsInformation(sectorIds)
      .then(sectorsInfo => {
        sectorsInfo.forEach((sectorInfo) => {
          sectorInformationById.value[sectorInfo.sector_id].num_products = sectorInfo.num_products;
          sectorInformationById.value[sectorInfo.sector_id].num_structural_indicators = sectorInfo.num_structural_indicators;
          sectorInformationById.value[sectorInfo.sector_id].num_structural_indicators_evaluated = sectorInfo.num_structural_indicators_evaluated;
          sectorInformationById.value[sectorInfo.sector_id].num_complementary_indicators = sectorInfo.num_complementary_indicators;
          sectorInformationById.value[sectorInfo.sector_id].num_complementary_indicators_evaluated = sectorInfo.num_complementary_indicators_evaluated;
        });
      });
}

onMounted(() => {
  TraceabilityApiMethods.fetchAllSectors().then((sectors) => sectorList.value = sectors);

  TraceabilityApiMethods.fetchCompany()
      .then((companyData) => {
        // sort alfabèticament
        return companySectors.value = companyData.sectors.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      })
      .then(() => {
        // initialize sectorInformationById
        companySectors.value.forEach((sector) => {
          sectorInformationById.value[sector.id] = {
            num_products: null,
            num_structural_indicators: null,
            num_structural_indicators_evaluated: null,
            num_complementary_indicators: null,
            num_complementary_indicators_evaluated: null,
          };
        });
      })
      .then(() => {
        const sectorsIds = companySectors.value.map((sector) => sector.id);
        fetchEvaluationsInformation(sectorsIds);
      });
});
</script>

<style scoped>
ion-list.sector-list {
  background: #fff;
}

ion-item {
  --ion-background-color: #fff;
  --ion-item-background: #fff;
}

.sector {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 8px 0;
}
</style>
