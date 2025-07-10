import SharedMethods from "@/shared/SharedMethods.js";
import Translation from "@/i18n/translation.js";

export default async function ({to, from, next, router, userStore}) {
    const companyHasEvaluationsDateSet = await SharedMethods.companyHasEvaluationsDateSet();
    if (!companyHasEvaluationsDateSet) {
        return router.push(
            Translation.i18nRoute({name: 'evaluation-date'})
        );
    }
    return next();
}
