<template>
  <div>
    <div class="card-subheader">{{ $t('profile.indicators.intro') }}</div>
    <div class="card-body">
      <div>
        <label>{{ $t('profile.indicators.company_type') }}</label>
        <div v-show="(companyFormData.cooperative_society===true)">Sí</div>
        <div v-show="(companyFormData.cooperative_society===false)">No</div>
        <div v-show="(companyFormData.cooperative_society===null)">-</div>
      </div>

      <div>
        <label>{{ $t('profile.indicators.workers_num') }}</label>
        <div class="value">{{ companyFormData.num_workers ?? '-' }}</div>
      </div>

      <div v-show="companyFormData.cooperative_society===false">
        <label>{{ $t('profile.indicators.workers_num_assalariats') }}</label>
        <div class="value">{{ companyFormData.num_workers_assalariats ?? '-' }}</div>
      </div>

    </div>
  </div>

</template>

<script setup>
import {defineProps} from "vue";
import {IonLabel} from '@ionic/vue';

const props = defineProps({
  companyFormData: Object,
});

const companyFormData = props.companyFormData;
</script>
