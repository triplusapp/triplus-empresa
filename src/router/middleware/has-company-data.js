import SharedMethods from "@/shared/SharedMethods.js";
import Translation from "@/i18n/translation.js";

export default async function ({to, from, next, router, userStore}) {
    const companyDataFilled = await SharedMethods.companyDataFilled();
    if (!companyDataFilled) {
        return router.push(
            Translation.i18nRoute({name: 'profile'})
        );
    }
    return next();
}
