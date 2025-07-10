import {createI18n} from 'vue-i18n';
import ca from "./locales/ca.json";
import es from "./locales/es.json";

// <p>{{ $t('message.hello', { msg: 'hello' }) }}</p>
// <label>{{ $t('message.homeAddress') }}</label>
// <p v-html="$t('message.hello')"></p>

export default createI18n({
    warnHtmlMessage: false,
    locale: 'ca',
    fallbackLocale: 'es',
    legacy: false, // you must set `false`, to use Composition API
    globalInjection: true, // injecting the translate function
    messages: {
        ca, es
    },
});
