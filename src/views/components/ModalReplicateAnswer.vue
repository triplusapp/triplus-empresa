<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="cancel">{{ $t('global.cancel_btn') }}</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="update" :strong="true" color="primary" shape="round" fill="solid">
          {{ $t('indicators.replicate_answer.action') }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  <ion-content class="ion-padding">
    <h1 class="modal-title">{{ $t('indicators.replicate_answer.title') }}</h1>
    <p>{{ $t('indicators.replicate_answer.message') }}</p>

    <div v-for="answer in candidate_answers_to_replicate_to" :key="answer.answer_id">
      <label>
        <input type="checkbox" :value="answer.answer_id" v-model="answers_to_replicate_to">
        {{ answer.title }}
      </label>
    </div>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    candidate_answers_to_replicate_to: {
      type: Array
    }
  },
  data() {
    return {
      answers_to_replicate_to: [],
    }
  },
  components: {IonContent, IonFooter, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonCheckbox},
  methods: {
    cancel() {
      return modalController.dismiss(null, 'cancel');
    },
    update() {
      return modalController.dismiss({
        answers_to_replicate_to: this.answers_to_replicate_to
      }, 'update');
    },
  },
});
</script>
