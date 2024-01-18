import { getQuizzes } from '../../api';
import QuizBrowser from '../../components/QuizBrowser';


const fetchQuizzes = async (page) => {
  try {
    const response = await getQuizzes(page);

    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
};

const QuizPage = async ({ searchParams }) => {

  const page = searchParams['page'] ?? '0';
  const quizzes = await fetchQuizzes(page);

  return (
    <main className='flex flex-col items-center justify-between p-8 lg:p-12'>
        {quizzes && (<QuizBrowser quizzes={quizzes} />)}
    </main>
  )
};

export default QuizPage;
