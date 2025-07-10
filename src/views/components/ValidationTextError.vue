<template>
  <div class="help-text-wrapper required" v-show="show">
    <ion-icon :icon="informationCircleOutline"></ion-icon>
    <div>{{ errorMessage }}</div>
  </div>
</template>
<script>

import {IonIcon} from '@ionic/vue';
import {informationCircleOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import {defineComponent, computed} from 'vue';

export default defineComponent({
  components: {
    IonIcon,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const {t} = useI18n();

    const errorMessage = computed(() => {
      return props.errorMessage || t('validations.required');
    });

    return {
      errorMessage,
      informationCircleOutline,
      t
    };
  },
});
</script>

<style scoped>
.help-text-wrapper {
  display: flex;
  align-items: center;
  margin-top: 0.4rem;
  gap: 0.3rem;
}

.help-text-wrapper.required {
  color: var(--ion-color-danger);
  font-size: 0.8rem;
  font-weight: bold;
}
</style>
