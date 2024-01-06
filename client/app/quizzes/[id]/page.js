import { notFound } from 'next/navigation';
import { getQuizById } from '../../api';
import QuizCard from '../../components/QuizCard';
import Quiz from './Quiz';
import Navbar from '../../components/Navbar';


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
            <Navbar />
            <div className='flex flex-col md:flex-row my-8 mx-6 md:m-12'>
                <div className='basis-1/3 md:mr-8 mb-8 md:mb-0'>
                    <QuizCard quizData={quizData} className=''></QuizCard>
                </div>
                <Quiz quizData={quizData}></Quiz>
            </div>
        </>
    );
};

export default QuizPage;
