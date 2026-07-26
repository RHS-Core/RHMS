export const getServices = async () => {
    return {
        success: true,
        message: "Hotel services fetched successfully.",
        data: [
            {
                id: 1,
                name: "Laundry",
                price: 50000,
            },
            {
                id: 2,
                name: "Breakfast",
                price: 120000,
            },
            {
                id: 3,
                name: "Spa",
                price: 300000,
            },
        ],
    };
};

export default {
    getServices,
};