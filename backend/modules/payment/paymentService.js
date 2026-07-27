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
                staffId: 1,
                amount: 500000,
                paymentMethod: "Cash",
                status: "Paid",
            },
            {
                id: 2,
                bookingId: 102,
                staffId: 2,
                amount: 1200000,
                paymentMethod: "Bank Transfer",
                status: "Pending",
            },
            {
                id: 3,
                bookingId: 103,
                staffId: 1,
                amount: 800000,
                paymentMethod: "Cash",
                status: "Paid",
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
export const getStaffRevenue = async (staffId) => {
    const result = await getPayments();

    const paidPayments = result.data.filter(
        (payment) =>
            payment.staffId == staffId &&
            payment.status === "Paid"
    );

    const totalRevenue = paidPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
    );

    return {
        success: true,
        message: "Staff revenue fetched successfully.",
        data: {
            staffId,
            totalRevenue,
            totalPayments: paidPayments.length,
        },
    };
};
export const getManagerRevenue = async () => {
    const result = await getPayments();

    const paidPayments = result.data.filter(
        (payment) => payment.status === "Paid"
    );

    const totalRevenue = paidPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
    );

    return {
        success: true,
        message: "Manager revenue fetched successfully.",
        data: {
            totalRevenue,
            totalPayments: paidPayments.length,
        },
    };
};
export const getAdminRevenue = async () => {
    const restaurantRevenue = 2500000;
    const hotelRevenue = 1800000;

    return {
        success: true,
        message: "Admin revenue fetched successfully.",
        data: {
            restaurantRevenue,
            hotelRevenue,
            totalRevenue: restaurantRevenue + hotelRevenue,
        },
    };
};

export default {
    createPayment,
    getPaymentMethods,
    getPayments,
    updatePaymentStatus,
    getStaffRevenue,
    getManagerRevenue,
    getAdminRevenue,

};