import i18n from "@/i18n";

const Trans = {
    async routeMiddleware(to, _from, next) {
        const paramLocale = to.params.locale;
        if (!Trans.isLocaleSupported(paramLocale)) {
            return next(Trans.guessDefaultLocale());
        }
        await Trans.switchLanguage(paramLocale);
        return next();
    },
    i18nRoute(to) {
        return {
            ...to,
            params: {
                locale: Trans.currentLocale,
                ...to.params
            }
        };
    },
    get defaultLocale() {
        return 'es';
    },
    guessDefaultLocale() {
        const userPersistedLocale = Trans.getPersistedLocale();
        if (userPersistedLocale) {
            return userPersistedLocale;
        }
        const userPreferredLocale = Trans.getUserLocale();
        if (Trans.isLocaleSupported(userPreferredLocale.locale)) {
            return userPreferredLocale.locale;
        }
        if (Trans.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
            return userPreferredLocale.localeNoRegion;
        }

        return Trans.defaultLocale;
    },
    isLocaleSupported(locale) {
        return Trans.supportedLocales.includes(locale);
    },
    getUserLocale() {
        const locale = window.navigator.language ||
            window.navigator.userLanguage ||
            Trans.defaultLocale;
        return {
            locale: locale,
            localeNoRegion: locale.split('-')[0]
        };
    },

    getPersistedLocale() {
        const persistedLocale = localStorage.getItem("user-locale");
        if (Trans.isLocaleSupported(persistedLocale)) {
            return persistedLocale;
        } else {
            return null;
        }
    },
    get supportedLocales() {
        return ['es', 'ca'];
    },
    get currentLocale() {
        return i18n.global.locale.value;
    },
    set currentLocale(newLocale) {
        i18n.global.locale.value = newLocale;
    },
    async switchLanguage(newLocale) {
        Trans.currentLocale = newLocale;
        document.querySelector("html").setAttribute("lang", newLocale);
        localStorage.setItem("user-locale", newLocale);
    },
    translatableProperty(property){
        if(property[Trans.currentLocale]){
            return property[Trans.currentLocale];
        }
        for (const locale of Trans.supportedLocales) {
            if (property[locale]) {
                return property[locale];
            }
        }
        return '';
    }
};

export default Trans;
