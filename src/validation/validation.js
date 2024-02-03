import { responseError } from "../error/response.error.js";

const validate = (schema, request) => {
    const result = schema.validate(request);
    if(result.error) throw new responseError(400, result.error.message);
    return result.value;
}

export {
    validate,
}