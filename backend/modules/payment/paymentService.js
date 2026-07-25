export const createPayment = async ({
    bookingId,
    amount,
    paymentMethod,
}) => {
    return {
        success: true,
        message: "Payment created successfully.",
        data: {
            bookingId,
            amount,
            paymentMethod,
            status: "Pending",
        },
    };
};

export default {
    createPayment,
};