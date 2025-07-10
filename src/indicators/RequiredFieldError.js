class RequiredFieldError extends Error {
    constructor(fieldName) {
        super(fieldName);
        this.name = "RequiredFieldError";
        this.fieldName = fieldName;
    }
}

export default RequiredFieldError;
