'use client';

import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import QuizGrid from './QuizGrid';
import { getRandomQuiz, getRandomQuizByCategory } from '../api';


const QuizBrowser = ({ quizzes, nextPage }) => {

    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();

    const page = searchParams.get('page') ?? '0';

    const prev = () => {
        router.replace(`${pathname}/?page=${Number(page) - 1}`);
    };

    const next = () => {
        router.replace(`${pathname}/?page=${Number(page) + 1}`);
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
        router.push(`/quizzes/${quiz.id}`);
    };

    return (
        <>
            {quizzes && quizzes.length !== 0 ? (<>

                <QuizGrid quizzes={quizzes} />

                <div className='flex flex-col w-full mx-auto md:w-2/3 lg:w-1/2 mt-12 md:mt-16 font-semibold text-2xl'>
                    <div className='flex flex-row w-full mb-4'>
                        <button
                            className='py-3 rounded-none rounded-l-lg'
                            disabled={page <= 0}
                            onClick={prev}
                        >
                            &lt;
                        </button>
                        <button
                            className='py-3 rounded-none'
                            onClick={random}
                        >
                            <p className='md:hidden text-2xl'>?</p>
                            <p className='hidden md:block'>random</p>
                        </button>
                        <button
                            className='py-3 rounded-none rounded-r-lg'
                            disabled={!quizzes || quizzes.length < 6 || !nextPage}
                            onClick={next}
                        >
                            &gt;
                        </button>
                    </div>
                    <button
                        className='bg-stone-400'
                        onClick={() => router.push('/')}
                    >
                        homepage
                    </button>
                </div>
            </>
            ) : (
                <div className='flex flex-col items-center justify-center h-96'>
                    <h3 className='text-4xl font-bold mb-4'>
                        Nothing to see here...
                    </h3>
                    <p className='accent-colored text-2xl font-semibold mb-4'>
                        Be the one to fill the void!
                    </p>
                    <button
                        className='main-btn text-2xl font-semibold py-3 max-w-lg mt-6'
                        onClick={() => router.push('/quizzes/make')}
                    >
                        create a quiz
                    </button>
                    <button
                        className='bg-stone-400 text-2xl font-semibold py-3 max-w-lg mt-4'
                        onClick={() => router.push('/')}
                    >
                        homepage
                    </button>
                </div>
            )}
        </ >
    );
};

export default QuizBrowser;
