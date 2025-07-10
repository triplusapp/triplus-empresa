import RequiredFieldError from "@/indicators/RequiredFieldError.js";

const module = (function () {
    function validate(indicator, formData, previous_binary_question_answer, indicatorTypeAnswerHasBeenAnswered) {
        if (formData.does_not_apply) {
            return true;
        }

        if (indicator.value.data.required_justification && (formData.answer == null || formData.answer.length === 0)) {
            throw new RequiredFieldError("indicator_justification");
        }
        // Check if the previous question, if exists, has been answered
        // No ha marcat que no li aplica. Per tant, li aplica i cal que introdueixi una resposta
        if ((previous_binary_question_answer.value === null) && (!formData.previous_binary_question_satisfied)) {
            throw new RequiredFieldError("previous_binary_question_answer");
        }

        // Check if the user answered the required questions
        // No ha contestat les preguntes
        // No ha marcat que no li aplica. Per tant, li aplica i cal que introdueixi una resposta
        // La resposta a la pregunta prèvia obliga que respongui les preguntes
        if (!indicatorTypeAnswerHasBeenAnswered && (formData.previous_binary_question_satisfied)) {
            return false;
        }

        // Check if escandall costos is filled
        if (indicator.value.evaluation_parameter.formula === 'escandall_costos') {
            const optionAnswerId = indicator.value.evaluation_parameter.options.findIndex(option => option.id === formData.value);
            if (optionAnswerId === 2) {
                return true; // Ha marcat que no mostra l'escandall
            }
            if (formData.formula == null) {
                return false;
            }
        }

        return true;
    }

    return {
        validate: validate,
    };
})();

export default module;


