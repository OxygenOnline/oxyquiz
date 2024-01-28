import { getCategories } from '../api';


const getCategoryList = async () => {
    try {
        const response = await getCategories();

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
};

module.exports = getCategoryList;
