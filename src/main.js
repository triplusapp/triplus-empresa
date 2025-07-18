import {createApp} from 'vue';
import App from './App.vue';
import {IonicVue} from '@ionic/vue';
import router from './router';
import {createPinia} from 'pinia';
import i18n from './i18n';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import "root/resources/js/media-library-pro-styles/dist/styles.css";

/* Theme variables */
import './theme/variables.css';
import '../public/assets/roobert/font.css';
import './theme/global.css';

const pinia = createPinia();

const app = createApp(App)
    .use(IonicVue)
    .use(i18n)
    .use(pinia)
    .use(router);

router.isReady().then(() => app.mount('#app'));
