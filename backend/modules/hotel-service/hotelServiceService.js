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
export const createService = async ({
    name,
    price,
}) => {
    return {
        success: true,
        message: "Hotel service created successfully.",
        data: {
            id: 4,
            name,
            price,
        },
    };
};

export default {
    getServices,
    createService,
};