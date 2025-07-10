import Translation from "@/i18n/translation.js";

export default function ({to, from, next, router, userStore}) {
    if (userStore.isLoggedIn) {
        return router.push(
            Translation.i18nRoute({ name: 'home' })
        );
    }

    return next();
}
