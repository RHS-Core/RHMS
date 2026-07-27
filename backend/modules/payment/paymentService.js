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

        roomCharge: 1200000,
        serviceCharge: 150000,
        restaurantCharge: 300000,
        totalAmount: 1650000,

        paymentMethod: "Cash",
        status: "Paid",
    },
    {
        id: 2,
        bookingId: 102,
        staffId: 2,

        roomCharge: 2000000,
        serviceCharge: 50000,
        restaurantCharge: 450000,
        totalAmount: 2500000,

        paymentMethod: "Bank Transfer",
        status: "Pending",
    },
    {
        id: 3,
        bookingId: 103,
        staffId: 1,

        roomCharge: 900000,
        serviceCharge: 100000,
        restaurantCharge: 0,
        totalAmount: 1000000,

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
    const payments = (await getPayments()).data;

    const staffPayments = payments.filter(
        (payment) =>
            payment.staffId === Number(staffId) &&
            payment.status === "Paid"
    );

    const totalRevenue = staffPayments.reduce(
        (sum, payment) => sum + payment.totalAmount,
        0
    );

    return {
        success: true,
        message: "Staff revenue fetched successfully.",
        data: {
            staffId: Number(staffId),
            totalRevenue,
            totalPayments: staffPayments.length,
        },
    };
};
export const getHotelManagerRevenue = async () => {
    const payments = (await getPayments()).data;

    const paidPayments = payments.filter(
        (payment) => payment.status === "Paid"
    );

    const totalRevenue = paidPayments.reduce(
        (sum, payment) =>
            sum +
            payment.roomCharge +
            payment.serviceCharge,
        0
    );

    return {
        success: true,
        message: "Hotel manager revenue fetched successfully.",
        data: {
            totalRevenue,
            totalPayments: paidPayments.length,
        },
    };
};
export const getRestaurantManagerRevenue = async () => {
    const payments = (await getPayments()).data;

    const paidPayments = payments.filter(
        (payment) => payment.status === "Paid"
    );

    const totalRevenue = paidPayments.reduce(
        (sum, payment) =>
            sum + payment.restaurantCharge,
        0
    );

    return {
        success: true,
        message: "Restaurant manager revenue fetched successfully.",
        data: {
            totalRevenue,
            totalPayments: paidPayments.length,
        },
    };
};
export const getAdminRevenue = async () => {
    const hotel = await getHotelManagerRevenue();
    const restaurant = await getRestaurantManagerRevenue();

    return {
        success: true,
        message: "Admin revenue fetched successfully.",
        data: {
            hotelRevenue: hotel.data.totalRevenue,
            restaurantRevenue: restaurant.data.totalRevenue,
            totalRevenue:
                hotel.data.totalRevenue +
                restaurant.data.totalRevenue,
        },
    };
};

export default {
    createPayment,
    getPaymentMethods,
    getPayments,
    updatePaymentStatus,

    getStaffRevenue,
    getHotelManagerRevenue,
    getRestaurantManagerRevenue,
    getAdminRevenue,
};