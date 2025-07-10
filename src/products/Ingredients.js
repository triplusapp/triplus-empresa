const module = (function () {
    async function handleCreation(productFormData, responseData) {
        if (responseData.parentIndexKey === null) {
            // Add Ingredient
            productFormData.ingredients.push({
                name_translations: responseData.name,
                percentage: responseData.percentage,
                unknown_location: responseData.unknown_location,
                formatted_address: responseData.formatted_address,
                longitude: responseData.longitude,
                latitude: responseData.latitude,
                address_components: responseData.address_components,
                subingredients: []
            });
        } else {
            // Add subingredient
            productFormData.ingredients[responseData.parentIndexKey].subingredients.push({
                name_translations: responseData.name, percentage: responseData.percentage,
            });
        }
        return productFormData;
    }

    async function handleUpdate(productFormData, responseData) {
        if (responseData.parentIndexKey === null) {
            // Edit Ingredient
            productFormData.ingredients[responseData.indexKey].name_translations = responseData.name;
            productFormData.ingredients[responseData.indexKey].percentage = responseData.percentage;
            productFormData.ingredients[responseData.indexKey].unknown_location = responseData.unknown_location;
            productFormData.ingredients[responseData.indexKey].formatted_address = responseData.formatted_address;
            productFormData.ingredients[responseData.indexKey].longitude = responseData.longitude;
            productFormData.ingredients[responseData.indexKey].latitude = responseData.latitude;
            productFormData.ingredients[responseData.indexKey].address_components = responseData.address_components;
        } else {
            // Edit subingredient
            productFormData.ingredients[responseData.parentIndexKey].subingredients[responseData.indexKey].name_translations = responseData.name;
            productFormData.ingredients[responseData.parentIndexKey].subingredients[responseData.indexKey].percentage = responseData.percentage;
        }
        return productFormData;
    }

    async function handleDeletion(productFormData, responseData) {
        if (responseData.parentIndexKey === null) {
            // Delete Ingredient
            productFormData.ingredients.splice(responseData.indexKey, 1);
        } else {
            // Delete Subingredient
            productFormData.ingredients[responseData.parentIndexKey].subingredients.splice(responseData.indexKey, 1);
        }

        return productFormData;
    }

    function sortAllIngredientsByParent(allIngredients) {
        // Crear un mapa per emmagatzemar els ingredients agrupats per parent_id
        const ingredientsMap = {};

        // Agrupar els ingredients pel seu parent_id
        allIngredients.forEach(ingredient => {
            if (ingredient.parent_id !== null) {
                if (!ingredientsMap[ingredient.parent_id]) {
                    ingredientsMap[ingredient.parent_id] = [];
                }
                ingredientsMap[ingredient.parent_id].push(ingredient);
            }
        });

        // Ordenar els ingredients principals i els seus subingredients
        const sortedIngredients = [];
        allIngredients.forEach(ingredient => {
            if (ingredient.parent_id === null) {
                sortedIngredients.push(ingredient);
                if (ingredientsMap[ingredient.id]) {
                    sortedIngredients.push(...ingredientsMap[ingredient.id]);
                }
            }
        });

        return sortedIngredients;
    }

    return {
        handleCreation: handleCreation,
        handleUpdate: handleUpdate,
        handleDeletion: handleDeletion,
        sortAllIngredientsByParent: sortAllIngredientsByParent,
    };
})();

export default module;


