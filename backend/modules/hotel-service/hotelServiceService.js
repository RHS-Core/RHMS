export const getServices = async () => {
    return {
        success: true,
        message: "Hotel services fetched successfully.",
        data: [
            {
                id: 1,
                name: "Breakfast",
                type: "hotel",
                price: 100000,
            },
            {
                id: 2,
                name: "Mini Bar",
                type: "hotel",
                price: 200000,
            },
            {
                id: 3,
                name: "Laundry",
                type: "hotel",
                price: 50000,
            },
            {
                id: 4,
                name: "Restaurant Order",
                type: "restaurant",
                price: 350000,
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
export const getServiceById = async (id) => {
    return {
        success: true,
        message: "Hotel service fetched successfully.",
        data: {
            id,
            name: "Laundry",
            price: 50000,
        },
    };
};
export const updateService = async (id, { name, price }) => {
    return {
        success: true,
        message: "Hotel service updated successfully.",
        data: {
            id,
            name,
            price,
        },
    };
};
export const deleteService = async (id) => {
    return {
        success: true,
        message: "Hotel service deleted successfully.",
        data: {
            id,
        },
    };
};

export default {
    getServices,
    createService,
    getServiceById,
    updateService,
    deleteService,
};