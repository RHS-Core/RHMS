export const validateCreateService = ({ name, price }) => {
    const errors = [];
    if (!name || name.trim() === "") {
        errors.push("Service name is required.");
    }
    if (!price || Number(price) <= 0) {
        errors.push("Price must be greater than 0.");
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};

export default {
    validateCreateService,
};