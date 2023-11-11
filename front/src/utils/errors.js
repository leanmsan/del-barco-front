class RequiredFieldError extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = "RequiredFieldError";
    }
}

export default RequiredFieldError;