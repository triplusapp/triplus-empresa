<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button :disabled="!(selectedChildSectors.length > 0 && childSelectors[childSelectors.length - 1].length === 0)"
                    @click="update" :strong="true" color="primary" fill="solid" shape="round">
          {{ $t('sectors.creation.action') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">
<h1 class="modal-title">{{$t('sectors.creation.title')}}</h1>
<p>{{ $t('sectors.creation.message')}}</p>
    <div class="select-wrapper">
      <ion-select
          :label="$t('sectors.creation.type_label')"
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :placeholder="$t('sectors.creation.type_placeholder')"
          v-model="sectorType" @ionChange="sectorTypeChanged"
          interface="popover">
        <ion-select-option value="Productors">Productor</ion-select-option>
        <ion-select-option value="Elaboradors">Elaborador</ion-select-option>
      </ion-select>
    </div>

    <div class="select-wrapper" v-if="sectorType">
      <ion-select
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('sectors.creation.sector_mare_label')"
          :placeholder="$t('sectors.creation.sector_placeholder')"
          interface="popover"
          v-model="selectedParentSector" @ionChange="parentSectorChanged">
        <ion-select-option v-for="sector in parentSectors" :key="sector.id" :value="sector.id">
          {{ sector.name }}
        </ion-select-option>
      </ion-select>

      <div v-if="selectedParentSector" class="sector-description">
        {{ sectorDescription(selectedParentSector) }}
      </div>
    </div>

    <div v-for="(childSelector, index) in childSelectors" :key="index">
      <div class="select-wrapper">
        <div v-if="childSelectors[index] && childSelectors[index].length>0">
          <ion-select
              class="input-custom"
              fill="solid"
              label-placement="floating"
              :label="$t('sectors.creation.sector_label')"
              :placeholder="$t('sectors.creation.sector_placeholder')"
              interface="popover"
              v-model="selectedChildSectors[index]"
              @ionChange="childSectorChanged(index)">
            <ion-select-option v-for="sector in childSelectors[index]" :key="sector.id" :value="sector.id">
              {{ sector.name }}
            </ion-select-option>
          </ion-select>
          <div v-if="selectedChildSectors[index]" class="sector-description">
            {{ sectorDescription(selectedChildSectors[index]) }}
          </div>
        </div>
      </div>
    </div>

  </ion-content>
</template>

<script lang="ts">
import {
  IonIcon,
  IonContent,
  IonFooter,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonInput,
  modalController,
  IonSelect,
  IonSelectOption, IonItem, IonList,
} from '@ionic/vue';
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    sectorList: {
      type: Array
    },
  },
  data() {
    return {
      // Add sector
      sectorType: null,
      childSelectors: null,
      selectedParentSector: null,
      selectedChildSectors: [],
    }
  },
  components: {
    IonList, IonItem,
    IonSelect, IonSelectOption,
    IonFooter, IonTitle, IonToolbar, IonContent, IonButtons, IonButton, IonInput, IonIcon
  },
  methods: {
    sectorDescription(sectorId) {
      const sector = this.sectorList.find((sector) => sector.id === sectorId);
      return sector.description;
    },
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    update() {
      let sectorIdToAdd = this.selectedChildSectors[this.selectedChildSectors.length - 1];

      return modalController.dismiss({
        sectorIdToAdd: sectorIdToAdd,
      }, 'create');
    },
    fetchChildSectors(parentId, index) {
      if (!this.childSelectors) {
        this.childSelectors = [];
      }
      this.childSelectors[index] = this.sectorList.filter(sector => sector.parent_id === parentId);
    },
    sectorTypeChanged() {
      this.selectedParentSector = null;
      this.childSelectors = null;
      this.selectedChildSectors = [];
    },
    parentSectorChanged(event) {
      this.childSelectors = null;
      this.selectedChildSectors = [];
      this.fetchChildSectors(event.detail.value, 0);
    },
    childSectorChanged(index) {
      if (this.selectedChildSectors[index]) {
        this.fetchChildSectors(this.selectedChildSectors[index], index + 1);
      }
    },
  },
  computed: {
    parentSectors() {
      if (!this.sectorType) {
        return [];
      }
      return this.sectorList.filter((sector) => !sector.parent_id).filter((sector) => sector.type === this.sectorType);
    },
    getChildSectors() {
      if (!this.newSector.parent_sector_id) {
        return [];
      }
      return this.sectorList.filter((sector) => sector.parent_id).filter((sector) => sector.parent_id === this.newSector.parent_sector_id);
    },
  }
});
</script>

<style scoped>
.select-wrapper {
  margin-bottom: 20px;
}

.sector-description {
  font-size: 0.9rem;
  line-height: 1.2rem;
  color: #888;
  margin-top: 0.3rem;
}

</style>
