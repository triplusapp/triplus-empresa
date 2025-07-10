<template>

  <div>
    <h4>{{ $t('profile.auditories.edificacions') }}</h4>
    <EdificacionsEdit/>

    <br><br>

    <h4>{{ $t('profile.auditories.terrenys') }}</h4>
    <p>{{ $t('profile.auditories.terrenys_info') }}</p>

    <div v-show="hasDunFile">
      <ion-button color="medium" @click="downloadDocument" shape="round" fill="outline">
        <ion-icon slot="start" :icon="download"></ion-icon>
        {{ $t('profile.auditories.download_document') }}
      </ion-button>

      <ion-button type="button" size="small" fill="clear"
                  color="danger"
                  shape="round"
                  @click="askDeleteConfirmation">
        <ion-icon slot="start" :icon="trashBin"></ion-icon>
        Eliminar
      </ion-button>
      <br>
      <br>
    </div>


    <div v-show="!hasDunFile">

      <div class="file-item" v-show="uploadingFile">
        <ion-spinner color="primary" name="circular"></ion-spinner>
        <div class="file-name">
          {{ $t('profile.auditories.uploading_document') }}
        </div>
      </div>

      <ion-input v-show="!uploadingFile" type="file" style="margin-top: 10px;" ref="inputFile"
                 @change="onFileChanged($event)"/>
    </div>

  </div>
  <ion-button color="medium" @click="cancelEditing" shape="round" fill="solid">
    {{ $t('global.back_btn') }}
  </ion-button>

</template>

<script setup>
import {defineProps, ref} from "vue";
import {alertController, IonButton, IonIcon, IonInput, IonLabel, IonSpinner} from '@ionic/vue';
import EdificacionsEdit from "@/views/components/profile/EdificacionsEdit.vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {download, trashBin} from "ionicons/icons";
import SharedMethods from "@/shared/SharedMethods.js";

const props = defineProps({
  companyFormData: Object,
});

const uploadingFile = ref(false);
const hasDunFile = ref(props.companyFormData.has_dun_file);
const dunFileName = ref(props.companyFormData.dun_file_name);
const inputFile = ref(null);

const cancelEditing = () => {
    window.location.reload();
};


const askDeleteConfirmation = async () => {
  const alertButtons = [
    {
      text: 'Cancel·lar',
      role: 'cancel',
    },
    {
      text: 'Sí, eliminar',
      role: 'confirm',
      handler: () => deleteDocument(),
    },
  ];
  const alert = await alertController.create({
    header: 'Eliminar document',
    message: 'Segur que vols eliminar el document adjunt?',
    buttons: alertButtons,
  });
  await alert.present();
}

const downloadDocument = async () => {
  TraceabilityApiMethods.downloadDunFile()
      .then((blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', dunFileName.value);
        document.body.appendChild(link);
        link.click();
      })
      .catch(message => SharedMethods.showErrorToast('Error file downloading'))
}

const deleteDocument = async () => {
  await TraceabilityApiMethods.deleteCompanyDunFile()
      .then(() => hasDunFile.value = false);
}

const onFileChanged = async ($event) => {
  const target = $event.target;
  uploadingFile.value = false;
  if (!target || !target.files) {
    return;
  }
  uploadingFile.value = true;

  let file = target.files[0];
  let formData = new FormData();
  formData.append('file', file);

  await TraceabilityApiMethods.uploadCompanyDunFile(formData)
      .then((response) => {
        dunFileName.value = response.file_name;
        hasDunFile.value = true;
        uploadingFile.value = false;
        inputFile.value.$el.value = null;
      });
}

</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1.5rem;
}

.file-item {
  display: flex;
  margin-top: 5px;
  align-items: center;
}

.file-item .file-name {
  margin-left: 15px;
}

.file-item .file-download {
  color: #3880ff;
  cursor: pointer;
}

</style>
