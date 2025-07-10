
const module = (function () {
    function allIngredientsFieldsAreFilled(ingredients) {
        const notFilledIngredients = ingredients.filter(function (ingredient) {
            if (ingredient.name == null || ingredient.percentage == null) {
                return true;
            }
            return (ingredient.name.length === 0 || ingredient.percentage.length === 0);
        });

        return (notFilledIngredients.length === 0);
    }

    return {
        allIngredientsFieldsAreFilled: allIngredientsFieldsAreFilled,
    };
})();

export default module;


