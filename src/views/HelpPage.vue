<template>
  <guest-layout>
    <div class="container">
      <a href="/"><img src="/assets/logo-h.svg?v=1" alt="logo" class="logo"/></a>

      <div class="content">

        <div class="main">
          <div class="card">

            <h2 class="icon-wrapper">
              <ion-icon slot="start" :icon="helpCircleOutline"></ion-icon>
              {{ $t('help.faqs') }}
            </h2>

            <ion-accordion-group :multiple="true" ref="mainAccordionGroup">
              <ion-accordion
                  v-for="category in faqsCategories" :key="category.name">
                >
                <ion-item slot="header">
                  <h3 class="icon-wrapper category">
                    <ion-icon slot="start" :icon="bookmarkOutline"></ion-icon>
                    {{ category.name }}
                  </h3>
                </ion-item>

                <div slot="content" class="tree">
                  <div v-for="faq in category.faqs" :key="faq.question">
                    <div class="question">- {{ faq.question }}</div>
                    <div slot="content" class="answer" v-html="faq.answer"></div>
                  </div>
                </div>

              </ion-accordion>
            </ion-accordion-group>
          </div>
        </div>

        <div class="sidebar">
          <div class="card">

            <h2 class="icon-wrapper">
              <ion-icon slot="start" :icon="documentOutline"></ion-icon>
              {{ $t('help.documents') }}
            </h2>

            <div v-for="(documents, category, index) in groupedDocuments" :key="category">
              <h3 class="document-category-title"
                  :class="{ 'mt': index > 0 }"
              >
                {{ categoryTitles[category] }}
              </h3>
              <div class="documents">
                <a v-for="document in documents" :key="document.url" class="document" target="_blank"
                   :href="document.url">
                  {{ document.name }}
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import GuestLayout from "@/layouts/GuestLayout.vue";
import SharedMethods from "@/shared/SharedMethods.js";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {bookmarkOutline, documentOutline, helpCircleOutline} from "ionicons/icons";
import {IonAccordion, IonAccordionGroup, IonButton, IonIcon, IonItem, IonLabel,} from '@ionic/vue';

const faqsCategories = ref([]);

const documents = ref([]);
const categoryOrder = ["manuals_protocols", "guies_referencies", "normes_juridiques"];
const categoryTitles = ref({});

const groupedDocuments = computed(() => {
  // Group documents by category
  const grouped = {};
  for (const doc of documents.value) {
    if (!grouped[doc.category]) {
      grouped[doc.category] = [];
    }
    grouped[doc.category].push(doc);
  }

  // Sort category documents
  const sortedGrouped = {};
  categoryOrder.forEach((category) => {
    if (grouped[category]) {
      sortedGrouped[category] = grouped[category].sort((a, b) => a.order - b.order);
    }
  });

  return sortedGrouped;
});

const fetchLegalDocuments = async () => {
  const loadingPage = await SharedMethods.showLoadingPage();
  TraceabilityApiMethods.fetchLegalDocuments()
      .then(function (data) {
        documents.value = data;

        for (const doc of documents.value) {
          if (!categoryTitles.value[doc.category]) {
            categoryTitles.value[doc.category] = doc.category_name;
          }
        }

      })
      .finally(() => loadingPage.dismiss());
}
const fetchFaqs = async () => {
  const loadingPage = await SharedMethods.showLoadingPage();
  TraceabilityApiMethods.fetchFaqs()
      .then(data => faqsCategories.value = data)
      .finally(() => loadingPage.dismiss());
}

onMounted(() => {
  fetchLegalDocuments();
  fetchFaqs();
});
</script>


<style scoped>
ion-accordion ion-item[slot='header'] {
  --background: white;
}
ion-accordion{
  background-color: white;
}
ion-accordion ion-item{
  --padding-start: 0;
}

.container {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 100px;
}

.content {
  display: flex;
  width: 100%;
  margin-top: 20px;
  flex-wrap: wrap;
}

.sidebar {
  flex: 1;
  max-width: 400px;
  padding-left: 20px;
}

.main {
  flex: 3;
  padding-right: 20px;
}

.category {
  margin-bottom: 20px;
  font-size: 1.1rem;
  display: block;
  font-weight: bold;
}

.question {
  font-weight: 600;
}

.answer {
  margin-bottom: 40px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card {
  background: #fff;
  padding: var(--ion-padding);
}

h2 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  display: block;
}

h3 {
  font-size: 1rem;
}

.document-category-title {
  font-weight: bold;

  &.mt {
    margin-top: 35px;
  }
}

.documents {
  display: flex;
  flex-direction: column;
  gap: 15px;

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}


@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .sidebar {
    border: none;
    padding: 0;
    margin-bottom: 20px;
  }

  .main {
    padding-left: 0;
  }

  h2, h3 {
    font-size: 1.1rem;
  }
}
</style>
