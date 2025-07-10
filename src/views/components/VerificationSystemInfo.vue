<template>
  <div v-if="info" class="box-info">
    <h5>
      <ion-icon size="large" color="primary" :icon="shieldCheckmarkOutline"></ion-icon>
      <span>{{ $t('indicators.verification_system.header') }}</span>
    </h5>
    <div class="rich-text" v-html="info"></div>
    <div class="footer">
      <ion-icon size="small" :icon="informationCircleOutline"></ion-icon>
      <small>{{ $t('indicators.verification_system.footer') }}</small>
    </div>
  </div>
</template>

<script setup>
import {IonIcon} from '@ionic/vue';

import {informationCircleOutline, shieldCheckmarkOutline} from 'ionicons/icons';

const props = defineProps({
  info: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.box-info {
  margin-top: 16px;
  border: 1px solid var(--ion-color-primary);
  background: rgba(var(--ion-color-primary-rgb), 0.2);
  padding: calc(var(--ion-padding) / 2) var(--ion-padding);
  border-radius: 8px;
}

h5 {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
}

.footer {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
