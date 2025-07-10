<template>

  <div>
    <div class="card-subheader">{{ $t('profile.auditories.intro') }}</div>
    <div class="card-body">
      <br>
      <ion-label class="subtitle">{{ $t('profile.auditories.edificacions') }}</ion-label>
      <div v-show="edificacions.length===0">
        {{ $t('profile.auditories.no_edificacions') }}
      </div>
      <div class="edificacions">
        <div v-for="edificacio in edificacions" class="edificacio">
          <div style="display: flex;width: 100%;align-items:center;padding: 4px 0;">
            <div style="flex: 1;">
              <h6 style="margin: 5px 0;">
                {{ edificacio.name }}
              </h6>
              <div>
                <small>
                  <ion-icon slot="start" :icon="pricetagOutline"></ion-icon> {{ edificacio.type.name }}
                </small>
              </div>
              <div>
                <small class="location">
                  <ion-icon slot="start" :icon="locationOutline"></ion-icon>
                  <span>{{ edificacio.location }}</span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br>
      <div v-show="hasDunFile">
        <ion-label class="subtitle">{{ $t('profile.auditories.terrenys') }}</ion-label>

        <div>
          <ion-button color="medium" @click="downloadDocument" shape="round" fill="outline">
            <ion-icon slot="start" :icon="download"></ion-icon>
            {{ $t('profile.auditories.download_document') }}
          </ion-button>
        </div>
      </div>

    </div>
  </div>

</template>

<script setup>
import {defineProps, ref} from "vue";
import {IonButton, IonIcon, IonLabel} from '@ionic/vue';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {download, location, locationOutline, pricetagOutline} from "ionicons/icons";
import SharedMethods from "@/shared/SharedMethods.js";
import {useI18n} from "vue-i18n";
const {t} = useI18n();

const props = defineProps({
  companyFormData: Object,
});

const hasDunFile = ref(props.companyFormData.has_dun_file);
const dunFileName = ref(props.companyFormData.dun_file_name);


const edificacions = ref([]);

TraceabilityApiMethods.fetchEdificacions()
    .then(response => edificacions.value = response);

const downloadDocument = async () => {
  TraceabilityApiMethods.downloadDunFile()
      .then((blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', dunFileName.value);
        document.body.appendChild(link);
        link.click();
      })
      .catch(message => SharedMethods.showErrorToast(t('profile.auditories.alert_messages.file_download_error')))
}
</script>

<style scoped>
.subtitle {
  margin-bottom: 0.5rem;
  display: block;
  text-decoration: underline;
}

.edificacions {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 5px;
}

.edificacio small {
  color: #888;
  font-size: 0.85rem;
  line-height: 1rem;
}
</style>
