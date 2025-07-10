<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="cancelChanges()">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-toolbar>
      <ion-searchbar @ionInput="searchbarInput($event)" placeholder="Buscar"></ion-searchbar>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-list id="modal-list" :inset="true">
      <ion-item v-for="item in filteredItems" :key="item.value"
                @click="isSelected(item.value) ? unselectItem() : selectItem(item)"
                style="cursor: pointer;"
                :class="{'active': isSelected(item.value)}">
        {{ item.text }}
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import type {SearchbarCustomEvent} from '@ionic/vue';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonSearchbar,
  IonToolbar,
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';

interface Item {
  text: string;
  value: string;
}

export default defineComponent({
  props: {
    items: Array<Item>,
    selectedItem: {
      type: [String, Number],
      default: null,
    },
  },
  emits: ['selection-cancel', 'selection-change'],
  components: {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonSearchbar,
    IonToolbar,
  },
  setup(props, {emit}) {
    const filteredItems = ref<Item[]>([...props.items]);
    const selectedItem = ref(props.selectedItem);

    const isSelected = (value: string) => {
      return selectedItem.value === value;
    };

    const cancelChanges = () => {
      emit('selection-cancel');
    };

    const confirmChanges = () => {
      emit('selection-change', selectedItem.value);
    };

    const searchbarInput = (ev: SearchbarCustomEvent) => {
      filterList(ev.target.value);
    };

    /**
     * Update the rendered view with
     * the provided search query. If no
     * query is provided, all data
     * will be rendered.
     */
    const filterList = (searchQuery: string | undefined) => {
      /**
       * If no search query is defined,
       * return all options.
       */
      if (searchQuery === undefined) {
        filteredItems.value = [...props.items];
      } else {
        /**
         * Otherwise, normalize the search
         * query and check to see which items
         * contain the search query as a substring.
         */
        const normalizedQuery = searchQuery.toLowerCase();
        filteredItems.value = props.items.filter((item) => {
          return item.text.toLowerCase().includes(normalizedQuery);
        });
      }
    };

    const selectItem = (item: Item) => {
      selectedItem.value = item.value;
      confirmChanges();
    };

    const unselectItem = () => {
      selectedItem.value = null;
      confirmChanges();
    };

    return {
      filteredItems,
      selectedItem,
      isSelected,
      cancelChanges,
      confirmChanges,
      searchbarInput,
      selectItem,
      unselectItem,
    };
  },
});
</script>
<style scoped>
#modal-list .active {
  --background: #fff;
  font-weight: bold;
}
</style>
