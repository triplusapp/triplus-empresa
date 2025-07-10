<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <slot/>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonContent, IonPage} from '@ionic/vue';
import {defineComponent} from 'vue';
</script>
