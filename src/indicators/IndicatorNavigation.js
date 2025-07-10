import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import SharedMethods from "@/shared/SharedMethods.js";
import Translation from "@/i18n/translation.js";

const module = (function () {
    function getSortedIndicatorsIds(indicators) {
        // Create categories tree & append indicators
        const categoriesTree = SharedMethods.createCategoriesSubcategoriesTree(indicators);
        for (let categoryIndex in categoriesTree) {
            for (let subcategoryIndex in categoriesTree[categoryIndex].subcategories) {
                let subcategoryId = categoriesTree[categoryIndex].subcategories[subcategoryIndex].id;
                categoriesTree[categoryIndex].subcategories[subcategoryIndex].indicators = indicators.filter(indicator => (indicator.data.subcategory.id === subcategoryId));
            }
        }

        // Transform categoriesTree into a sorted array of indicators
        let sortedIndicatorsIds = [];
        for (const category of categoriesTree) {
            for (const subcategory of category.subcategories) {
                for (const indicator of subcategory.indicators) {
                    sortedIndicatorsIds.push(indicator.data.id);
                }
            }
        }
        return sortedIndicatorsIds;
    }

    async function create(evaluableModelType, indicatorId, evaluableModelId) {
        let indicators;
        let exitUrl;
        let nextIndicatorUrl = null;
        let previousIndicatorUrl = null;
        let slugIndicator = null;

        if (evaluableModelType === 'company') {
            indicators = await TraceabilityApiMethods.fetchCompanyIndicators();
            exitUrl = Translation.i18nRoute({name: 'company'});
            slugIndicator = 'company';
        } else if (evaluableModelType === 'sector') {
            indicators = await TraceabilityApiMethods.fetchSectorIndicators(evaluableModelId);
            exitUrl = Translation.i18nRoute({
                name: 'sector',
                params: {
                    sectorId: evaluableModelId,
                }
            });
            slugIndicator = 'sector';
        } else {
            indicators = await TraceabilityApiMethods.fetchProductIndicators(evaluableModelId);

            exitUrl = Translation.i18nRoute({
                name: 'product-evaluation',
                params: {
                    productId: evaluableModelId,
                }
            });

            slugIndicator = 'product';
        }

        // discard the indicators that can't be evaluated (probably automatic score)
        indicators = indicators.filter(indicator => indicator.can_be_evaluated);

        // sort indicators by code
        let sortedIndicatorsIds = getSortedIndicatorsIds(indicators);

        // Set previous and next indicator
        let index = sortedIndicatorsIds.indexOf(indicatorId);
        let previousIndicatorId = index > 0 ? sortedIndicatorsIds[index - 1] : null;
        let nextIndicatorId = index < sortedIndicatorsIds.length - 1 ? sortedIndicatorsIds[index + 1] : null;

        if (previousIndicatorId) {
            previousIndicatorUrl = Translation.i18nRoute({
                name: 'indicator',
                params: {
                    evaluableModelType: slugIndicator,
                    indicatorId: previousIndicatorId,
                    evaluableModelId: evaluableModelId,
                }
            });
        }
        if (nextIndicatorId) {
            nextIndicatorUrl = Translation.i18nRoute({
                name: 'indicator',
                params: {
                    evaluableModelType: slugIndicator,
                    indicatorId: nextIndicatorId,
                    evaluableModelId: evaluableModelId,
                }
            });
        }

        return {
            exitUrl: exitUrl,
            nextIndicatorUrl: nextIndicatorUrl,
            previousIndicatorUrl: previousIndicatorUrl
        };
    }

    return {
        create,
    };
})();

export default module;


