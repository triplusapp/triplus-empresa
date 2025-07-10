<template>

  <div class="users">
    <div v-for="user in users" class="user">
      <div>
        <ion-label>{{ user.email }}</ion-label>
        <div v-if="user.is_main" class="main-user-badge">
          {{ $t('settings.users.main_user.indicator') }}
        </div>
      </div>
      <div class="user-actions">
        <ion-button v-if="!user.is_main" :disabled="userStore.user.email===user.email" type="button" size="small" shape="round" fill="outline" color="medium"
                    @click="askSetMainUserConfirmation(user)">
          <ion-icon slot="start" :icon="star"></ion-icon>
          {{ $t('settings.users.main_user.set_as_main') }}
        </ion-button>
        <ion-button :disabled="userStore.user.email===user.email" type="button" size="small" shape="round" fill="clear" color="danger"
                    @click="askDeleteConfirmation(user)"
                    title="Eliminar"
        >
          <ion-icon :icon="trashBin"></ion-icon>
        </ion-button>
      </div>
    </div>
  </div>

  <ion-button type="button" size="small" fill="outline" shape="round"
              @click="openAddUserModal">
    <ion-icon slot="start" :icon="add"></ion-icon>
    {{ $t('settings.users.add_user') }}
  </ion-button>

</template>

<script setup>
import {alertController, IonButton, IonIcon, IonLabel, modalController} from '@ionic/vue';
import {onMounted, ref} from 'vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {useUserStore} from "@/store/user.store.js";
import ModalAddCompanyUser from "@/views/components/company-users/ModalAddCompanyUser.vue";
import SharedMethods from "@/shared/SharedMethods.js";
import {add, star, trashBin} from "ionicons/icons";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const userStore = useUserStore();
const users = ref([]);

const fetchUsers = async () => {
  TraceabilityApiMethods.fetchCompanyUsers()
      .then(response => users.value = response);
}

const deleteUser = async (userId) => {
  TraceabilityApiMethods.deleteCompanyUser(userId)
      .then((response) => {
        fetchUsers();
        SharedMethods.showSuccessfulToast(t('settings.users.alert_messages.deleted_user'));
      });
}

const openAddUserModal = async (sectorList) => {
  const modal = await modalController.create({
    component: ModalAddCompanyUser,
  });

  await modal.present();
  const response = await modal.onWillDismiss();

  if (response.role === 'created') {
    SharedMethods.showSuccessfulToast(t('settings.users.alert_messages.added_user'));
    fetchUsers();
  }
}

const askDeleteConfirmation = async (user) => {
  const alertButtons = [
    {
      text: t('settings.users.delete_confirmation.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('settings.users.delete_confirmation.confirm_btn'),
      role: 'confirm',
      handler: () => deleteUser(user.id),
    },
  ];
  const alert = await alertController.create({
    header: t('settings.users.delete_confirmation.header'),
    message: t('settings.users.delete_confirmation.message', {mail: user.email}),
    buttons: alertButtons,
  });
  await alert.present();
}

const askSetMainUserConfirmation = async (user) => {
  const alertButtons = [
    {
      text: t('settings.users.main_user.confirmation.cancel_btn'),
      role: 'cancel',
    },
    {
      text: t('settings.users.main_user.confirmation.confirm_btn'),
      role: 'confirm',
      handler: () => setMainUser(user.id),
    },
  ];
  const alert = await alertController.create({
    header: t('settings.users.main_user.confirmation.header'),
    message: t('settings.users.main_user.confirmation.message', {mail: user.email}),
    buttons: alertButtons,
  });
  await alert.present();
}

const setMainUser = async (userId) => {
  TraceabilityApiMethods.setMainCompanyUser(userId)
      .then(() => {
        SharedMethods.showSuccessfulToast(t('settings.users.alert_messages.set_main_user'));
        userStore.setCompanyMainUser(userId);
      });
}

onMounted(() => fetchUsers());

</script>

<style scoped>
.users {
  margin-bottom: 1rem;
}

.users .user:first-child {
  border-top: 1px solid #ccc;
}

.user {
  display: grid;
  grid-template-columns: 400px 1fr;
  grid-gap: 3px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ccc;
  align-items: center;
}
</style>
