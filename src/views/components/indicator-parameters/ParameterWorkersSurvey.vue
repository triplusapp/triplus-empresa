<template>
  <div>
    <ion-button type="button" size="default" @click="copyLinkWorkerSurvey" shape="round">
      <ion-icon slot="start" :icon="copyOutline"></ion-icon>
      {{ $t('indicators.parameters.workers_survey.copy_link_btn')}}
    </ion-button>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';
import {IonButton, IonIcon} from '@ionic/vue';

import {copyOutline} from 'ionicons/icons';

const props = defineProps({
  copyLinkWorkerSurvey: Function
});
</script>

<style scoped>
.text-muted {
  font-size: 0.9rem;
  line-height: 1.2rem;
  color: #999;
}
</style>
