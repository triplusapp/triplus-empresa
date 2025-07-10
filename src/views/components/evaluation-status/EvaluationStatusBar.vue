<template>
  <div v-if="openAtDateSet">

    <div class="alert alert-info">
      <ion-icon :icon="informationCircleOutline"></ion-icon>
        {{ statusMessage }}
    </div>

    <div v-if="displayFinishEvaluationsBtn">
      <ion-button type="button" size="default" @click="openConfirmationModal" shape="round">
        {{ $t('evaluation_status_bar.finish_btn') }}
      </ion-button>
    </div>
  </div>
</template>

<script setup>
import {IonButton, modalController, IonIcon} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import ModalConfirmation from "@/views/components/evaluation-status/ModalConfirmation.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {onMounted, ref} from "vue";
import {informationCircleOutline} from "ionicons/icons";
import {useUserStore} from "@/store/user.store.js";

const {t} = useI18n();

const status = ref(null);
const statusMessage = ref(null);
const displayFinishEvaluationsBtn = ref(false);
const openAtDateSet = ref(null);

const openConfirmationModal = async () => {
  const modal = await modalController.create({
    component: ModalConfirmation,
  });

  await modal.present();
  const response = await modal.onWillDismiss();

  if (response.role === 'confirm') {
    TraceabilityApiMethods.setEvaluationsAsFinished()
        .then((response) => {
          status.value = response.new_status;
          fetchStatus();
        });
  }
}
const userStore = useUserStore();
const mainUser = ref(userStore.user.isMainUser);

const fetchStatus = async () => {
  TraceabilityApiMethods.fetchCompany()
      .then((companyData) => {
        openAtDateSet.value = companyData.evaluations_open_at_set;
        status.value = companyData.evaluations_status;
        statusMessage.value = companyData.evaluations_status_message;
        displayFinishEvaluationsBtn.value = mainUser.value && companyData.display_finish_evaluations_btn;
      });
}

onMounted(() => fetchStatus());
</script>
<style scoped>
.alert{

}
</style>
