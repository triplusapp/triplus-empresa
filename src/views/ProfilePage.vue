<template>
  <main-layout>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t('profile.page_title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding profile-page">
      <div v-if="companyFetched">
        <div v-if="!editing">

          <div class="alert-danger" v-show="missingRequiredBrandsData">
            <span>{{ $t('profile.alert_messages.section_brands_required') }}</span>
            <ion-button @click="editing='public'" size="small" color="primary" shape="round" fill="outline">
              {{ $t('profile.add_missing_info_btn') }}
            </ion-button>
          </div>

          <div class="alert-danger" v-show="missingRequiredIndicatorData">
            <span>{{ $t('profile.alert_messages.section_indicators_required') }}</span>
            <ion-button @click="editing='indicators'" size="small" color="primary" shape="round" fill="outline">
              {{ $t('profile.add_missing_info_btn') }}
            </ion-button>
          </div>

          <div class="alert-danger" v-show="numEdificacions===0">
            <span>{{ $t('profile.alert_messages.section_auditories_required') }}</span>
            <ion-button @click="editing='auditories'" size="small" color="primary" shape="round" fill="outline">
              {{ $t('profile.add_missing_info_btn') }}
            </ion-button>
          </div>

          <div class="card">
            <div class="card-header">
              <span>{{ $t('profile.public.title') }}</span>
              <ion-button @click="editing='public'" size="small" color="primary" shape="round" fill="outline">
                {{ $t('global.edit_btn') }}
              </ion-button>
            </div>
            <ViewPublic :initial-media="initialMedia" :company-form-data="companyFormData"/>
          </div>

          <div class="card card-mt">
            <div class="card-header">
              <span>{{ $t('profile.indicators.title') }}</span>
              <ion-button @click="editing='indicators'" size="small" color="primary" shape="round" fill="outline">
                {{ $t('global.edit_btn') }}
              </ion-button>
            </div>

            <ViewIndicators :company-form-data="companyFormData"/>
          </div>

          <div class="card card-mt">
            <div class="card-header">
              <span>{{ $t('profile.auditories.title') }}</span>
              <ion-button @click="editing='auditories'" size="small" color="primary" shape="round" fill="outline">
                {{ $t('global.edit_btn') }}
              </ion-button>
            </div>
            <ViewAuditories :company-form-data="companyFormData"/>

          </div>

        </div>

        <EditPublic
            v-if="editing==='public'"
            :initial-media="initialMedia"
            :company-form-data="editFormData.companyFormData"
            @cancel-editing="cancelEditing"
        />

        <EditIndicators
            v-if="editing==='indicators'"
            :company-form-data="editFormData.companyFormData"
            @cancel-editing="cancelEditing"
        />
        <EditAuditories
            v-if="editing==='auditories'"
            :company-form-data="editFormData.companyFormData"
            @cancel-editing="cancelEditing"
        />

      </div>
    </ion-content>
  </main-layout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import {onBeforeMount, ref} from "vue";
import {IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar} from '@ionic/vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import ViewPublic from "@/views/components/profile/ViewPublic.vue";
import ViewIndicators from "@/views/components/profile/ViewIndicators.vue";
import ViewAuditories from "@/views/components/profile/ViewAuditories.vue";
import EditPublic from "@/views/components/profile/EditPublic.vue";
import EditIndicators from "@/views/components/profile/EditIndicators.vue";
import EditAuditories from "@/views/components/profile/EditAuditories.vue";

const editing = ref(null);
const companyFetched = ref(false);

const initialMedia = ref({});
const missingRequiredIndicatorData = ref(null);
const missingRequiredBrandsData = ref(null);
const numEdificacions = ref(null);
const companyFormData = ref({
  name: null,
  legal_name: null,
  address: null,
  description: null,
  cooperative_society: null,
  num_workers: null,
  num_workers_assalariats: null,
  has_dun_file: null,
  brands: []
});

const editFormData = ref({});

const fetchCompany = async () => {
  const loadingPage = await SharedMethods.showLoadingPage();
  TraceabilityApiMethods.fetchCompany()
      .then((data) => {
        initialMedia.value = data.media;
        companyFormData.value.num_workers = data.num_workers;
        companyFormData.value.num_workers_assalariats = data.num_workers_assalariats;
        companyFormData.value.cooperative_society = data.cooperative_society;
        companyFormData.value.name = data.name;
        companyFormData.value.legal_name = data.legal_name;
        companyFormData.value.address = data.address;
        companyFormData.value.description = data.description;
        companyFormData.value.has_dun_file = data.has_dun_file;
        companyFormData.value.brands = data.brands;
        companyFormData.value.dun_file_name = data.dun_file_name;
        missingRequiredBrandsData.value = companyFormData.value.brands.length === 0;
        missingRequiredIndicatorData.value = false;
        if (companyFormData.value.cooperative_society === null) {
          missingRequiredIndicatorData.value = true;
        }
        if (companyFormData.value.num_edificacions === 0) {
          missingRequiredIndicatorData.value = true
        }
        if ( isNaN(parseInt(companyFormData.value.num_workers))) {
          missingRequiredIndicatorData.value = true
        }

        numEdificacions.value = data.num_edificacions;
        companyFetched.value = true;
        editFormData.value.companyFormData = {...companyFormData.value};
      })
      .finally(() => loadingPage.dismiss());
};

const cancelEditing = () => editing.value = null;

onBeforeMount(() => fetchCompany());
</script>

<style>

.profile-page .card {
  background: #fff;
  padding: var(--ion-padding);
}

.profile-page .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
}

.profile-page .card-subheader {
  margin-top: calc(var(--ion-padding) / 2);
}

.profile-page .card-mt {
  margin-top: var(--ion-padding);
}

.profile-page label {
  color: #666666;
  font-size: 0.8rem;
  margin-top: var(--ion-padding);
  display: block;
}

.profile-page .alert-danger {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

</style>
