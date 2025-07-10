<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button :disabled="!selectedSubcategory" @click="confirmSelection" :strong="true" color="primary" fill="solid"
                    shape="round">
          {{ $t('products.manage.modal_category.confirm') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>

  <ion-content class="ion-padding">
    <h1 class="modal-title">{{ $t('products.manage.modal_category.title') }}</h1>
    <p>{{ $t('products.manage.modal_category.message') }}</p>
    <div class="select-wrapper">
      <ion-select
          :label="$t('products.manage.modal_category.section_label')"
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :placeholder="$t('products.manage.modal_category.section_placeholder')"
          v-model="selectedSection"
          @ionChange="onSectionChange"
          interface="popover">
        <ion-select-option v-for="section in sections" :key="section.id" :value="section.id">
          {{ section.name }}
        </ion-select-option>
      </ion-select>
    </div>

    <div class="select-wrapper" v-if="selectedSection">
      <ion-select
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('products.manage.modal_category.category_label')"
          :placeholder="$t('products.manage.modal_category.category_placeholder')"
          v-model="selectedCategory"
          @ionChange="onCategoryChange"
          interface="popover">
        <ion-select-option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </ion-select-option>
      </ion-select>
    </div>

    <div class="select-wrapper" v-if="selectedCategory">
      <ion-select
          class="input-custom"
          fill="solid"
          label-placement="floating"
          :label="$t('products.manage.modal_category.subcategory_label')"
          :placeholder="$t('products.manage.modal_category.subcategory_placeholder')"
          v-model="selectedSubcategory"
          interface="popover">
        <ion-select-option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
          {{ subcategory.name }}
        </ion-select-option>
      </ion-select>
    </div>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonFooter,
  IonToolbar,
  IonButtons,
  IonButton,
  IonSelect,
  IonSelectOption,
  modalController,
} from '@ionic/vue';
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    productCategories: {
      type: Array,
      required: true,
    },
    initialSubcategory: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      selectedSection: null,
      selectedCategory: null,
      selectedSubcategory: null,
    };
  },
  computed: {
    sections() {
      return this.productCategories
          .filter(category => category.parent_id === null)
          .sort((a, b) => a.code - b.code);
    },
    categories() {
      return this.productCategories
          .filter(category => category.parent_id === this.selectedSection)
          .sort((a, b) => a.code - b.code);
    },
    subcategories() {
      return this.productCategories
          .filter(category => category.parent_id === this.selectedCategory)
          .sort((a, b) => a.code - b.code);
    },
  },
  methods: {
    initializeSelection() {
      if (this.initialSubcategory) {
        const subcategory = this.productCategories.find(cat => cat.id === this.initialSubcategory);
        if (subcategory) {
          this.selectedSubcategory = subcategory.id;

          const category = this.productCategories.find(cat => cat.id === subcategory.parent_id);
          if (category) {
            this.selectedCategory = category.id;

            const section = this.productCategories.find(cat => cat.id === category.parent_id);
            if (section) {
              this.selectedSection = section.id;
            }
          }
        }
      }
    },
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    confirmSelection() {
      return modalController.dismiss({
        selectedCategory: this.selectedSubcategory,
      }, 'confirm');
    },
    onSectionChange() {
      this.selectedCategory = null;
      this.selectedSubcategory = null;
    },
    onCategoryChange() {
      this.selectedSubcategory = null;
    },
  },
  mounted() {
    this.initializeSelection();
  },
  components: {
    IonContent,
    IonFooter,
    IonToolbar,
    IonButtons,
    IonButton,
    IonSelect,
    IonSelectOption,
  },
});
</script>

<style scoped>
.select-wrapper {
  margin-bottom: 20px;
}
</style>
