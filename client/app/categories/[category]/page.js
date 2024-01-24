import { notFound } from 'next/navigation';
import { getCategoryQuizzes } from '../../api';
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

const CategoryPage = async ({ params, searchParams }) => {

    const page = searchParams['page'] ?? '0';
    const quizzes = await fetchQuizzes(params.category, page);

    if (!quizzes) {
        notFound();
    }

    return (
        <main className='m-8 justify-center lg:mx-12 lg:my-16'>
            <QuizBrowser quizzes={quizzes} />
        </main >
    );
};

export default CategoryPage;
