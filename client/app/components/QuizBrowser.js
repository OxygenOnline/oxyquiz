'use client';

import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import QuizGrid from './QuizGrid';
import { getRandomQuiz, getRandomQuizByCategory } from '../api';


const QuizBrowser = ({ quizzes }) => {

    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();

    const page = searchParams.get('page') ?? '0';

    const prev = () => {
        router.replace(`${pathname}/?page=${Number(page) - 1}`)
    };

    const next = () => {
        router.replace(`${pathname}/?page=${Number(page) + 1}`)
    };

    const random = async () => {
        let response = null;
        if (params.category) {
            response = await getRandomQuizByCategory(params.category);
        }
        else {
            response = await getRandomQuiz();
        }
        const quiz = await response.json();
        router.push(`/quizzes/${quiz.id}`)
    };

    return (
        <>

            {quizzes && quizzes.length !== 0 && (<>

                <QuizGrid quizzes={quizzes} />

                <div className='flex flex-row lg:w-2/5 mx-auto pt-8 md:pt-16 font-semibold text-2xl'>
                    <button
                        className='py-3 rounded-none rounded-l-lg hover:shadow-none'
                        disabled={page <= 0}
                        onClick={prev}
                    >
                        &lt;
                    </button>
                    <button
                        className='py-3 rounded-none hover:shadow-none'
                        onClick={random}
                    >
                        <p className='md:hidden text-2xl'>?</p>
                        <p className='hidden md:block'>random</p>
                    </button>
                    <button
                        className='py-3 rounded-none rounded-r-lg hover:shadow-none'
                        disabled={!quizzes || quizzes.length < 6}
                        onClick={next}
                    >
                        &gt;
                    </button>
                </div>
            </>
            )}
        </ >
    );
};

export default QuizBrowser;
