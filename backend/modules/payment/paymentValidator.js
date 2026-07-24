export const validateCreatePayment = ({
    bookingId,
    amount,
    paymentMethod,
}) => {
    const errors = [];
    if (!bookingId) {
    errors.push("Booking ID is required.");
}

if (!amount || Number(amount) <= 0) {
    errors.push("Amount must be greater than 0.");
}

if (!paymentMethod || paymentMethod.trim() === "") {
    errors.push("Payment method is required.");
}

return {
    isValid: errors.length === 0,
    errors,
};
};

export default {
    validateCreatePayment,
};