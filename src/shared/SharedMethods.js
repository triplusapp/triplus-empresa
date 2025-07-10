import {loadingController, toastController} from "@ionic/vue";
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import Translation from "@/i18n/translation.js";

export default {
    companyDataFilled() {
        return TraceabilityApiMethods.fetchCompany()
            .then(function (companyData) {
                if (companyData.cooperative_society === null) {
                    return false;
                }
                if (companyData.num_edificacions === 0) {
                    return false;
                }
                if (companyData.brands.length === 0) {
                    return false;
                }
                return (
                    !isNaN(parseFloat(companyData.num_workers))
                );
            });
    },
    companyHasSelectedSectors() {
        return TraceabilityApiMethods.fetchCompany()
            .then((companyData) => (companyData.sectors.length > 0));
    },
    companyHasEvaluationsDateSet() {
        return TraceabilityApiMethods.fetchCompany()
            .then((companyData) => (companyData.evaluations_open_at_set));
    },
    createCategoriesSubcategoriesTree(indicators) {
        let categories = indicators.reduce((acc, curr) => {
            const existingCategory = acc.find(item => item.id === curr.data.category.id);
            if (existingCategory) {
                const existingSubcategory = existingCategory.subcategories.find(sub => sub.id === curr.data.subcategory.id);
                if (!existingSubcategory) {
                    existingCategory.subcategories.push(curr.data.subcategory);
                }
            } else {
                acc.push({
                    id: curr.data.category.id,
                    name: curr.data.category.name,
                    code: curr.data.category.code,
                    subcategories: [curr.data.subcategory],
                });
            }
            return acc;
        }, []);

        // Sort subcategories & categories by code
        return categories
            .map((category) => {
                category.subcategories = category.subcategories.sort(function (a, b) {
                    return a.code - b.code;
                });
                return category;
            })
            .sort(function (a, b) {
                return a.code - b.code;
            });
    },
    async showErrorToast(message, duration = 3000) {
        const toast = await toastController.create({
            message: message,
            duration: duration,
            color: 'danger',
            position: 'bottom',
        });

        await toast.present();
    },
    async showSuccessfulToast(message, duration = 1500) {
        const toast = await toastController.create({
            message: message,
            duration: duration,
            color: 'success',
            position: 'bottom',
        });

        await toast.present();
    },

    async showLoadingPage(message = 'Carregant...') {
        const loading = await loadingController.create({
            message: message,
        });

        await loading.present();
        return loading;
    },
    isValidMultilangField(field) {
        return typeof field === 'object' &&
            'ca' in field && field.ca?.trim() !== ''; // &&
            // 'es' in field && field.es?.trim() !== ''; // multidioma no requerit temporalment
    }
};
