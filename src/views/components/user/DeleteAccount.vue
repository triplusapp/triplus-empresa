<template>

  <ion-button type="button" size="small" fill="outline"
              color="danger"
              shape="round"
              @click="askDeleteConfirmation">
    <ion-icon slot="start" :icon="trashBin"></ion-icon>
    {{ $t('settings.account.delete_account_btn') }}
  </ion-button>

</template>

<script setup>
import {alertController, IonButton, IonIcon} from '@ionic/vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {trashBin} from "ionicons/icons";
import {useUserStore} from "@/store/user.store.js";
import {useI18n} from "vue-i18n";
const {t} = useI18n();

const deleteAccount = async () => {
  TraceabilityApiMethods.deleteAccount()
      .then((response) => useUserStore().logout());
}

const askDeleteConfirmation = async () => {
  const alertButtons = [
    {
      text: t('global.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('settings.account.delete_confirmation.confirm_btn'),
      role: 'confirm',
      handler: () => deleteAccount(),
    },
  ];
  const alert = await alertController.create({
    header: t('settings.account.delete_confirmation.header'),
    message: t('settings.account.delete_confirmation.message'),
    buttons: alertButtons,
  });
  await alert.present();
}

</script>

<style scoped>

</style>

