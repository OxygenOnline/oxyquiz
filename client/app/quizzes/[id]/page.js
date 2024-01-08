import { notFound } from 'next/navigation';
import { getQuizById } from '../../api';
import QuizCard from '../../components/QuizCard';
import Quiz from './Quiz';


const fetchQuiz = async (quizId) => {
    try {
        const response = await getQuizById(quizId);

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

const QuizPage = async ({ params }) => {

    const quizData = await fetchQuiz(params.id);

    if (!quizData) {
        notFound();
    }

    return (
        <>
            <main className='flex flex-col lg:flex-row my-8 mx-6 lg:m-12'>
                <div className='basis-1/3 lg:mr-8 mb-8 lg:mb-0'>
                    <QuizCard quizData={quizData} className=''></QuizCard>
                </div>
                <Quiz quizData={quizData}></Quiz>
            </main>
        </>
    );
};

export default QuizPage;
