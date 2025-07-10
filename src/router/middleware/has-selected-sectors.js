import SharedMethods from "@/shared/SharedMethods.js";
import Translation from "@/i18n/translation.js";

export default async function ({to, from, next, router, userStore}) {
    const companyHasSectors = await SharedMethods.companyHasSelectedSectors();
    if (!companyHasSectors) {
        return router.push(
            Translation.i18nRoute({name: 'sectors'})
        );
    }
    return next();
}
