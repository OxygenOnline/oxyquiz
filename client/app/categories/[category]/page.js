import { notFound } from 'next/navigation';
import { getCategoryQuizzes, getCategoryQuizNumber } from '../../api';
import QuizBrowser from '../../components/QuizBrowser';


const fetchQuizzes = async (categoryName, page) => {

    try {
        const response = await getCategoryQuizzes(categoryName, page);

        if (response.status === 404) {
            return undefined;
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
};

const isNavigationAllowed = async (categoryName, page) => {
    try {
        const response = await getCategoryQuizNumber(categoryName);

        const numberOfQuizzes = await response.json();
        const totalPages = Math.ceil(numberOfQuizzes / 6);
        const nextPageDisabled = (Number(page) + 1) === totalPages;
        return !nextPageDisabled;
    }
    catch (error) {
        console.error(error);
    }
};

const CategoryPage = async ({ params, searchParams }) => {

    const page = searchParams['page'] ?? '0';
    const quizzes = await fetchQuizzes(params.category, page);
    const nextPage = await isNavigationAllowed(params.category, Number(page));

    if (!quizzes) {
        notFound();
    }

    return (
        <main className='m-8 justify-center lg:mx-12 lg:my-16'>
            <QuizBrowser quizzes={quizzes} nextPage={nextPage} />
        </main >
    );
};

export default CategoryPage;
