<template>


  <div v-show="edificacions.length===0">
    <div class="alert-danger">
      <span>{{ $t('profile.auditories.alert_messages.edificacions_required') }}</span>
    </div>
  </div>

  <ion-list :inset="true">

    <ion-item v-for="edificacio in edificacions" class="edificacio">
      <div style="display: flex;width: 100%;align-items:center;padding: 4px 0;">
        <div style="flex: 1;">
          <h6 style="margin: 5px 0;">
            {{ edificacio.name }}
          </h6>
          <div>
            <small>
              <ion-icon slot="start" :icon="pricetagOutline"></ion-icon> {{ edificacio.type.name }}
            </small>
          </div>
          <div>
            <small class="location">
              <ion-icon slot="start" :icon="locationOutline"></ion-icon>
              <span>{{ edificacio.location }}</span>
            </small>
          </div>
        </div>
        <div style="display: flex; gap: 20px;align-items:center;">
          <ion-button type="button" size="small" color="primary" fill="clear"
                      @click="openEditEdificacioModal(edificacio)">
            <ion-icon :icon="createOutline"></ion-icon>
          </ion-button>
          <ion-button type="button" size="small" fill="clear" color="danger"
                      @click="askDeleteConfirmation(edificacio)">
            <ion-icon :icon="trashBin"></ion-icon>
          </ion-button>
        </div>
      </div>
    </ion-item>
  </ion-list>

  <ion-button type="button" size="small" fill="outline" shape="round"
              @click="openAddEdificacioModal">
    <ion-icon slot="start" :icon="add"></ion-icon>
    {{ $t('profile.auditories.add_edificacio') }}
  </ion-button>

</template>

<script setup>
import {alertController, IonButton, IonIcon, IonItem, IonLabel, IonList, modalController} from '@ionic/vue';
import {onMounted, ref} from 'vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import {
  add,
  business,
  businessOutline,
  businessSharp,
  createOutline,
  location, locationOutline,
  pricetag, pricetagOutline, pricetagSharp,
  trashBin
} from "ionicons/icons";
import ModalEdificacio from "@/views/components/profile/ModalEdificacio.vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const edificacions = ref([]);
const edificacionsTypes = ref([]);

const fetchEdificacions = async () => {
  TraceabilityApiMethods.fetchEdificacions()
      .then(response => edificacions.value = response);
}
const fetchEdificacionsTypes = async () => {
  TraceabilityApiMethods.fetchEdificacionsTypes()
      .then(response => edificacionsTypes.value = response);
}

const deleteEdificacio = async (edificacioId) => {
  TraceabilityApiMethods.deleteEdificacio(edificacioId)
      .then(() => {
        fetchEdificacions();
        SharedMethods.showSuccessfulToast(t('profile.auditories.alert_messages.edificacio_deleted'));
      });
}

const openAddEdificacioModal = async () => {
  const modal = await modalController.create({
    component: ModalEdificacio,
    componentProps: {edificacionsTypes: edificacionsTypes.value}
  });

  await modal.present();
  const response = await modal.onWillDismiss();

  if (response.role === 'created') {
    SharedMethods.showSuccessfulToast(t('profile.auditories.alert_messages.edificacio_added'));
    fetchEdificacions();
  }
}

const openEditEdificacioModal = async (edificacio) => {
  const modal = await modalController.create({
    component: ModalEdificacio,
    componentProps: {
      edificacio: { ...edificacio },
      edificacionsTypes: edificacionsTypes.value
    }
  });

  await modal.present();
  const response = await modal.onWillDismiss();

  if (response.role === 'updated') {
    SharedMethods.showSuccessfulToast(t('global.alert_messages.saved'));
    fetchEdificacions();
  }
};

const askDeleteConfirmation = async (edificacio) => {
  const alertButtons = [
    {
      text: t('global.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('global.delete_confirmation_btn'),
      role: 'confirm',
      handler: () => deleteEdificacio(edificacio.id),
    },
  ];
  const alert = await alertController.create({
    header: t('profile.auditories.edificacio_delete_confirmation.header'),
    message: t('profile.auditories.edificacio_delete_confirmation.message'),
    buttons: alertButtons,
  });
  await alert.present();
}


onMounted(() => {
  fetchEdificacionsTypes();
  fetchEdificacions();
});

</script>

<style scoped>

.location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 5px;
}

.edificacio small {
  color: #888;
  font-size: 0.85rem;
  line-height: 1rem;
}

ion-item.edificacio {
  --ion-background-color: #fff;
  --ion-item-background: #fff;
}

</style>

