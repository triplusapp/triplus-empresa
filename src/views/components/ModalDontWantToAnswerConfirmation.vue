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
    <h1 class="modal-title">{{ $t('indicators.dont_want_to_answer_confirmation.title') }}</h1>
    <p>{{ $t('indicators.dont_want_to_answer_confirmation.message') }}</p>
  </ion-content>
</template>

<script setup lang="ts">
import {IonContent, IonFooter, IonToolbar, IonButtons, IonButton, modalController} from '@ionic/vue';

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => modalController.dismiss(null, 'confirm');
</script>

