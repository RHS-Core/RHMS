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

export const getPaymentMethods = async () => {
    return {
        success: true,
        message: "Payment methods fetched successfully.",
        data: [
            { id: 1, name: "Cash" },
            { id: 2, name: "Bank Transfer" },
            { id: 3, name: "Credit Card" },
        ],
    };
};

export default {
    createPayment,
    getPaymentMethods,
};