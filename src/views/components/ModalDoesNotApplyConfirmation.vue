<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="confirm" :strong="true" color="primary" shape="round" fill="solid">Confirmar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">

    <h1 class="modal-title">{{ $t('indicators.does_not_apply_confirmation.title') }}</h1>
    <p>{{ $t('indicators.does_not_apply_confirmation.message') }}</p>

    <br>
    <div class="alert alert-danger">
      {{ $t('indicators.does_not_apply_confirmation.alert_message') }}
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { IonContent, IonFooter, IonToolbar, IonButtons, IonButton, modalController } from '@ionic/vue';

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => modalController.dismiss(null, 'confirm');
</script>
