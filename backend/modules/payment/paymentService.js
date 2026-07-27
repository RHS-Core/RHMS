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

export const getPayments = async () => {
    return {
        success: true,
        message: "Payments fetched successfully.",
        data: [
            {
                id: 1,
                bookingId: 101,
                amount: 500000,
                paymentMethod: "Cash",
                status: "Paid",
            },
            {
                id: 2,
                bookingId: 102,
                amount: 1200000,
                paymentMethod: "Bank Transfer",
                status: "Pending",
            },
        ],
    };
};
export const updatePaymentStatus = async (id, status) => {
    return {
        success: true,
        message: "Payment status updated successfully.",
        data: {
            id,
            status,
        },
    };
};

export default {
    createPayment,
    getPaymentMethods,
    getPayments,
    updatePaymentStatus,

};