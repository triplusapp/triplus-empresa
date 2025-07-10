import RequiredFieldError from "@/indicators/RequiredFieldError.js";

const IndicatorParser = (function() {

    function parseIndicatorTypeAnswerValue(
        indicator,
        indicatorParameterType,
        indicatorRadioTypeForm,
        indicatorRangeTypeForm,
        indicatorRankingTypeForm,
        indicatorClimaticZoneTypeForm,
        indicatorMultipleSimpleComponentsTypeForm,
        indicatorMultiplePercentagesPonderatsTypeForm,
        indicatorConditionalRangeTypeForm,
        indicatorConditionalRadioTypeForm,
        indicatorPercentagesIngredientsPonderatsTypeForm,
        indicatorConditionalMultiplePercentagesPonderatsTypeForm,
        indicatorPercentagesAllIngredientsPonderatsTypeForm,
        indicatorPercentagesAllIngredientsPonderatsNaTypeForm
    ) {
        const parser = getParserForType(indicatorParameterType);

        if (!parser) {
            return {
                value: null,
                hasBeenAnswered: false,
                missingRequiredFields: []
            };
        }

        return parser(
            indicator,
            {
                radioTypeForm: indicatorRadioTypeForm,
                rangeTypeForm: indicatorRangeTypeForm,
                rankingTypeForm: indicatorRankingTypeForm,
                climaticZoneTypeForm: indicatorClimaticZoneTypeForm,
                multipleSimpleComponentsTypeForm: indicatorMultipleSimpleComponentsTypeForm,
                multiplePercentagesPonderatsTypeForm: indicatorMultiplePercentagesPonderatsTypeForm,
                conditionalRangeTypeForm: indicatorConditionalRangeTypeForm,
                conditionalRadioTypeForm: indicatorConditionalRadioTypeForm,
                percentagesIngredientsPonderatsTypeForm: indicatorPercentagesIngredientsPonderatsTypeForm,
                conditionalMultiplePercentagesPonderatsTypeForm: indicatorConditionalMultiplePercentagesPonderatsTypeForm,
                percentagesAllIngredientsPonderatsTypeForm: indicatorPercentagesAllIngredientsPonderatsTypeForm,
                percentagesAllIngredientsPonderatsNaTypeForm: indicatorPercentagesAllIngredientsPonderatsNaTypeForm
            }
        );
    }

    /**
     * Get the appropriate parser function for a given indicator type
     * @param {String} type - The indicator parameter type
     * @returns {Function|null} The parser function for the type
     */
    function getParserForType(type) {
        const parsers = {
            'radio': parseRadioType,
            'range': parseRangeType,
            'ranking': parseRankingType,
            'climatic_zone': parseClimaticZoneType,
            'multiple_simple_components': parseMultipleSimpleComponentsType,
            'extra_component_additional_score': parseMultipleSimpleComponentsType,
            'multiple_percentages_ponderats': parseMultiplePercentagesPonderatsType,
            'conditional_ranges': parseConditionalRangesType,
            'conditional_radios': parseConditionalRadiosType,
            'percentages_ingredients_ponderats': parsePercentagesIngredientsPonderatsType,
            'percentages_all_ingredients_ponderats': parsePercentagesAllIngredientsPonderatsType,
            'percentages_all_ingredients_ponderats_na': parsePercentagesAllIngredientsPonderatsNaType,
            'conditional_multiple_percentages_ponderats': parseConditionalMultiplePercentagesPonderatsType
        };

        return parsers[type] || null;
    }

    /**
     * Parse radio type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parseRadioType(indicator, forms) {
        const answer = forms.radioTypeForm.value.optionId;
        const hasBeenAnswered = (answer && answer.length > 0);
        const missingRequiredFields = [];

        if (!hasBeenAnswered) {
            missingRequiredFields.push('indicatorRadioTypeForm.optionId');
        }

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse range type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parseRangeType(indicator, forms) {
        const answer = forms.rangeTypeForm.value.value;
        const hasBeenAnswered = (answer != null && String(answer).length > 0);
        const missingRequiredFields = [];

        if (!hasBeenAnswered) {
            missingRequiredFields.push('indicatorRangeTypeForm.value');
        }

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse ranking type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parseRankingType(indicator, forms) {
        const answer = forms.rankingTypeForm.value.value;
        const hasBeenAnswered = (answer && answer.length > 0);

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields: []
        };
    }

    /**
     * Parse climatic zone type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parseClimaticZoneType(indicator, forms) {
        const missingRequiredFields = [];
        const answer = {
            edificacio_id: forms.climaticZoneTypeForm.value.edificacio_id,
            energy_consumption: forms.climaticZoneTypeForm.value.energy_consumption,
        };

        const hasBeenAnswered = (answer.energy_consumption && answer.edificacio_id);

        if (!answer.edificacio_id) {
            missingRequiredFields.push('indicatorClimaticZoneTypeForm.edificacio_id');
        }
        if (!answer.energy_consumption) {
            missingRequiredFields.push('indicatorClimaticZoneTypeForm.energy_consumption');
        }

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse multiple simple components type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parseMultipleSimpleComponentsType(indicator, forms) {
        const answer = [];
        const missingRequiredFields = [];
        const form = forms.multipleSimpleComponentsTypeForm;

        // Process percentages
        for (let componentId in form.value.percentages) {
            answer.push({
                component_id: componentId,
                percentage: form.value.percentages[componentId],
            });
        }

        // Process multiple percentages
        for (let optionId in form.value.multiplePercentages) {
            let multiplePercentage = form.value.multiplePercentages[optionId];
            let componentId = indicator.value.evaluation_parameter.options
                .filter((element) => element.type === 'multiple_percentages_ponderats')[0].component_id;

            if (String(multiplePercentage).length > 0) {
                answer.push({
                    component_id: componentId,
                    option_id: optionId,
                    percentage: multiplePercentage,
                });
            }
        }

        // Process conditional option IDs
        for (let componentId in form.value.conditionalOptionId) {
            let conditionalOptionId = form.value.conditionalOptionId[componentId];
            answer.push({
                component_id: componentId,
                conditional_option_id: conditionalOptionId,
            });
        }

        // Process radio options
        for (let componentId in form.value.radioOptionsIds) {
            answer.push({
                component_id: componentId,
                option_id: form.value.radioOptionsIds[componentId],
            });
        }

        // Check required answers
        let requiredNumberOfAnswers = indicator.value.evaluation_parameter.options.length;
        for (let i in indicator.value.evaluation_parameter.options) {
            const currentOption = indicator.value.evaluation_parameter.options[i];

            // Adjust required number for special types
            if (currentOption.type === 'conditional_multiple_percentages_ponderats') {
                requiredNumberOfAnswers += currentOption.options.option_answers.length - 1;
            }
            if (currentOption.type === 'multiple_percentages_ponderats') {
                requiredNumberOfAnswers += currentOption.options.length - 1;
            }

            // Register missing fields
            let found = answer.find(item => item.component_id === currentOption.component_id);
            if (found === undefined) {
                let errorKeyMessage = '';
                if (currentOption.type === 'radio') {
                    errorKeyMessage = 'indicatorMultipleSimpleComponentsTypeForm.radioOptionsIds.' + currentOption.component_id;
                } else if (currentOption.type === 'range') {
                    errorKeyMessage = 'indicatorMultipleSimpleComponentsTypeForm.percentages.' + currentOption.component_id;
                } else if (currentOption.type === 'multiple_percentages_ponderats') {
                    errorKeyMessage = 'indicatorMultipleSimpleComponentsTypeForm.multiplePercentages.' + currentOption.component_id;
                }
                missingRequiredFields.push(errorKeyMessage);
            }
        }

        const hasBeenAnswered = (answer.length === requiredNumberOfAnswers);

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse multiple percentages ponderats type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parseMultiplePercentagesPonderatsType(indicator, forms) {
        const answer = [];
        const missingRequiredFields = [];
        const form = forms.multiplePercentagesPonderatsTypeForm;

        for (let key in form.value.options) {
            const percentage = form.value.options[key];
            if (percentage !== '' && percentage !== null && percentage !== undefined && !isNaN(percentage)) {
                answer.push({ option_id: key, percentage: Number(percentage) });
            }
        }

        // Register missing fields
        for (let option of indicator.value.evaluation_parameter.options) {
            let exists = answer.find(item => item.option_id === option.id);
            if (exists === undefined) {
                let errorKeyMessage = 'indicatorMultiplePercentagesPonderatsTypeForm.' + option.id;
                missingRequiredFields.push(errorKeyMessage);
            }
        }

        const hasBeenAnswered = (answer.length === indicator.value.evaluation_parameter.options.length);

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse conditional ranges type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parseConditionalRangesType(indicator, forms) {
        const missingRequiredFields = [];
        const form = forms.conditionalRangeTypeForm;

        const answer = {
            option_id: form.value.optionId,
            value: form.value.value,
        };

        const hasBeenAnswered = (answer.value && answer.value.length > 0);

        if (!answer.conditional_option_id) {
            missingRequiredFields.push('indicatorConditionalRangeTypeForm.conditionalOptionId');
        } else if (!answer.option_id) {
            missingRequiredFields.push('indicatorConditionalRangeTypeForm.value');
        }

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse conditional radios type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parseConditionalRadiosType(indicator, forms) {
        const missingRequiredFields = [];
        const form = forms.conditionalRadioTypeForm;

        const answer = {
            conditional_option_id: form.value.conditionalOptionId,
            option_id: form.value.optionId,
        };

        const hasBeenAnswered = (answer.option_id && answer.option_id.length > 0);

        if (!answer.conditional_option_id) {
            missingRequiredFields.push('indicatorConditionalRadioTypeForm.conditionalOptionId');
        } else if (!answer.option_id) {
            missingRequiredFields.push('indicatorConditionalRadioTypeForm.optionId');
        }

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse percentages ingredients ponderats type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parsePercentagesIngredientsPonderatsType(indicator, forms) {
        const answer = [];
        const missingRequiredFields = [];
        const formValues = forms.percentagesIngredientsPonderatsTypeForm.value;

        for (let aux in formValues) {
            if (formValues[aux].optionId) {
                answer.push({
                    option_id: formValues[aux].optionId,
                    ingredient_id: formValues[aux].ingredient.id,
                });
            } else {
                let errorKeyMessage = 'indicatorPercentagesIngredientsPonderatsTypeForm.' + formValues[aux].ingredient.id;
                missingRequiredFields.push(errorKeyMessage);
            }
        }

        const hasBeenAnswered = (formValues.length > 0 && answer.length === formValues.length);

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse percentages all ingredients ponderats type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parsePercentagesAllIngredientsPonderatsType(indicator, forms) {
        const answer = [];
        const missingRequiredFields = [];
        const formValues = forms.percentagesAllIngredientsPonderatsTypeForm.value;

        for (let aux in formValues) {
            if (formValues[aux].optionId) {
                answer.push({
                    option_id: formValues[aux].optionId,
                    ingredient_id: formValues[aux].ingredient.id,
                });
            } else {
                let errorKeyMessage = 'indicatorPercentagesAllIngredientsPonderatsTypeForm.' + aux;
                missingRequiredFields.push(errorKeyMessage);
            }
        }

        const hasBeenAnswered = (formValues.length > 0 && answer.length === formValues.length);

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse percentages all ingredients ponderats na type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parsePercentagesAllIngredientsPonderatsNaType(indicator, forms) {
        const answer = [];
        const missingRequiredFields = [];
        const allIngredients = forms.percentagesAllIngredientsPonderatsNaTypeForm.value;

        // Function to check if an ingredient has subingredients
        const isIngredientWithSubingredients = (ingredient) => {
            if (ingredient.parent_id) {
                return false;
            }

            // Check if the current ingredient has subingredients
            const hasSubingredients = allIngredients
                .filter((row) => row.ingredient.parent_id === ingredient.id)
                .length > 0;

            return hasSubingredients;
        };

        // Filter to include only ingredients without subingredients
        let requiredIngredientsAnswers = allIngredients
            .filter((row) => !isIngredientWithSubingredients(row.ingredient));

        // Process each required ingredient
        for (let aux in requiredIngredientsAnswers) {
            if (requiredIngredientsAnswers[aux].optionId) {
                answer.push({
                    option_id: requiredIngredientsAnswers[aux].optionId,
                    ingredient_id: requiredIngredientsAnswers[aux].ingredient.id,
                });
            } else {
                let errorKeyMessage = 'indicatorPercentagesAllIngredientsPonderatsNaTypeForm.' + requiredIngredientsAnswers[aux].ingredient.id;
                missingRequiredFields.push(errorKeyMessage);
            }
        }

        const hasBeenAnswered = (requiredIngredientsAnswers.length > 0 && answer.length === requiredIngredientsAnswers.length);

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Parse conditional multiple percentages ponderats type indicator
     * @param {Object} indicator - The indicator object
     * @param {Object} forms - The form objects
     * @returns {Object} Processed answer with validation info
     */
    function parseConditionalMultiplePercentagesPonderatsType(indicator, forms) {
        const missingRequiredFields = [];
        const form = forms.conditionalMultiplePercentagesPonderatsTypeForm;
        let answer = null;
        let hasBeenAnswered = false;

        if (form.value.conditionalOptionId) {
            let percentages = [];

            for (let key in form.value.options) {
                if (key in form.value.options) {
                    percentages.push({
                        option_id: key,
                        percentage: form.value.options[key],
                    });
                }
            }

            answer = {
                conditional_option_id: form.value.conditionalOptionId,
                percentages: percentages,
            };

            const requiredPercentageOptions = indicator.value.evaluation_parameter.options.option_answers
                .find(option => option.question_answer_id == answer.conditional_option_id).option_percentages;

            hasBeenAnswered = percentages.length === requiredPercentageOptions.length;

            for (let key in requiredPercentageOptions) {
                const optionId = requiredPercentageOptions[key].option_id;
                if (percentages.find(answer => answer.option_id === optionId) === undefined) {
                    missingRequiredFields.push('indicatorConditionalMultiplePercentagesPonderatsTypeForm.' + optionId);
                }
            }
        } else {
            missingRequiredFields.push('indicatorConditionalMultiplePercentagesPonderatsTypeForm.conditionalOptionId');
        }

        return {
            value: answer,
            hasBeenAnswered,
            missingRequiredFields
        };
    }

    /**
     * Create form data from indicator and form values
     * @param {Object} indicator - The indicator object
     * @param {Object} commonForm - Common form values
     * @param {Object} indicatorTypeAnswerValue - Processed type-specific answer value
     * @returns {Object} Form data ready for submission
     */
    function createFormData(indicator, commonForm, indicatorTypeAnswerValue) {
        return {
            comment: commonForm.value.comments,
            does_not_apply: (commonForm.value.does_not_apply) ? 1 : 0,
            previous_binary_question_satisfied: (commonForm.value.previous_binary_question_satisfied) ? 1 : 0,
            answer: commonForm.value.answer,
            formula: commonForm.value.formula,
            value: indicatorTypeAnswerValue,
            files: commonForm.value.files.map(file => file.fileId)
        };
    }

    return {
        parseIndicatorTypeAnswerValue,
        createFormData,
    };
})();

export default IndicatorParser;
