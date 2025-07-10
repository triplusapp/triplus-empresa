<template>
  <div>
    <ion-input
        class="input-custom input-number"
        fill="solid"
        label-placement="floating"
        :label="$t('indicators.parameters.ranking.answer')"
        placeholder="0"
        v-model="indicatorRankingTypeForm.value"
        onwheel="return false;"
        type="number"
        min="0"/>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';
import {IonInput} from '@ionic/vue';

const props = defineProps({
  indicatorRankingTypeForm: Object
});
</script>
