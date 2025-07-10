<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content class="sidebar-content">
          <ion-list id="inbox-list">
            <ion-list-header>
              <img src="/assets/logo-h.svg?v=1" alt="logo" class="logo">
            </ion-list-header>

            <ion-menu-toggle :auto-hide="false" v-for="(p, i) in sidebarNavigationItems" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root"
                        :router-link="Translation.i18nRoute({ name: p.routeName })" lines="none"
                        style="cursor:pointer;"
                        :detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>

          <evaluation-status-bar/>

          <div class="spacer"></div>
        </ion-content>

        <ion-list class="documentation-list bottom-nav">
          <ion-menu-toggle :auto-hide="false" v-for="(p, i) in documentationItems" :key="i">
            <ion-item @click="selectedIndex = sidebarNavigationItems.length + i" router-direction="root"
                      :router-link="Translation.i18nRoute({ name: p.routeName })" lines="none"
                      style="cursor:pointer;"
                      :detail="false" class="hydrated" :class="{ selected: selectedIndex === sidebarNavigationItems.length + i }">
              <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
              <ion-label>{{ p.title }}</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ion-list>

        <ion-footer class="ion-no-border">
          <ion-toolbar>
            <div style="display: flex;align-items: center;justify-content: space-around;">
              <small style="font-size: 0.9rem;" class="link" @click="openContactModal">
                {{ $t('contact.open_modal') }}
              </small>

              <small style="font-size: 0.9rem;" class="link" @click="goToHelpPage">
                <ion-icon slot="start" :icon="informationCircle"></ion-icon>
                {{ $t('help.help_btn') }}
              </small>

              <LanguageSwitcher/>
            </div>
          </ion-toolbar>
        </ion-footer>
      </ion-menu>

      <div class="ion-page" id="main-content">
        <slot></slot>
      </div>
    </ion-split-pane>
  </ion-page>
</template>

<script setup>
import {
  IonContent,
  IonFooter,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonSplitPane,
  IonToolbar,
  modalController,
} from '@ionic/vue';

import {
  bookmarkOutline,
  bookmarkSharp,
  businessOutline,
  businessSharp,
  documentOutline,
  documentSharp,
  homeOutline,
  homeSharp,
  informationCircle,
  personCircleOutline,
  personCircleSharp,
  pricetagsOutline,
  pricetagsSharp,
  settingsOutline,
  settingsSharp,
} from 'ionicons/icons';
import Translation from "@/i18n/translation.js";
import {ref} from 'vue';
import LanguageSwitcher from "@/views/components/LanguageSwitcher.vue";
import {useRoute, useRouter} from "vue-router";
import ModalContact from "@/views/components/ModalContact.vue";

import {useI18n} from "vue-i18n";
import EvaluationStatusBar from "@/views/components/evaluation-status/EvaluationStatusBar.vue";

const router = useRouter();
const {t} = useI18n();

const sidebarNavigationItems = [
  {
    title: t('nav.home'),
    routeName: 'home',
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: t('nav.settings'),
    routeName: 'account',
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
  },
  {
    title: t('nav.profile'),
    routeName: 'profile',
    iosIcon: personCircleOutline,
    mdIcon: personCircleSharp,
  },
  {
    title: t('nav.company'),
    routeName: 'company',
    iosIcon: businessOutline,
    mdIcon: businessSharp,
  },
  {
    title: t('nav.sector'),
    routeName: 'sectors',
    iosIcon: bookmarkOutline,
    mdIcon: bookmarkSharp,
  },
  {
    title: t('nav.products'),
    routeName: 'products',
    iosIcon: pricetagsOutline,
    mdIcon: pricetagsSharp,
  }
];

const documentationItems = [
  {
    title: t('nav.legal_documents'),
    routeName: 'legal-documents',
    iosIcon: documentOutline,
    mdIcon: documentSharp,
  },
  {
    title: t('nav.audit_reports'),
    routeName: 'audit-reports',
    iosIcon: documentOutline,
    mdIcon: documentSharp,
  }
];

const selectedIndex = ref(null);

const route = useRoute();
const currentRouteName = route.name;
if (currentRouteName) {
  // First check in main navigation items
  selectedIndex.value = sidebarNavigationItems.findIndex((page) => page.routeName === currentRouteName);

  // If not found, check in documentation items
  if (selectedIndex.value === -1) {
    const docIndex = documentationItems.findIndex((page) => page.routeName === currentRouteName);
    if (docIndex !== -1) {
      selectedIndex.value = sidebarNavigationItems.length + docIndex;
    }
  }
}

const openContactModal = async () => {
  const modal = await modalController.create({
    component: ModalContact,
  });
  await modal.present();
}

const goToHelpPage = () => {
  const resolvedRoute = router.resolve(
      Translation.i18nRoute({name: 'help'})
  );
  window.open(resolvedRoute.href, '_blank');
};

</script>
<style scoped>
.logo {
  width: 120px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.spacer {
  flex-grow: 1;
}

.bottom-nav {
  margin-bottom: 0;
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
}
</style>
