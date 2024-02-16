'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import QuizRow from './QuizRow';


const QuizTable = ({ quizzes, nextPage }) => {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = searchParams.get('page') ?? '0';

    const prev = () => {
        router.replace(`${pathname}/?page=${Number(page) - 1}`);
    };

    const next = () => {
        router.replace(`${pathname}/?page=${Number(page) + 1}`);
    };

    return (
        <div className='container flex flex-col min-h-40 py-6 items-center justify-center mb-12'>
            {!quizzes || quizzes.length === 0 && page <= 0 ? (
                <p className='text-center text-xl font-semibold'>No quizzes available</p>
            ) : (
                <>
                    <table className='table border-collapse text-center w-full'>
                        <thead className='font-semibold text-2xl text-current'>
                            <tr>
                                <th className='pb-2'>Quizzes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map((quiz) => (
                                <QuizRow key={quiz.id} quiz={quiz} />
                            ))}
                        </tbody>
                    </table>
                    {(page <= 0 && quizzes.length < 12) || (
                        <div className='flex w-5/6 md:w-3/4 lg:w-3/5 mt-6'>
                            <button
                                className='py-2 rounded-none rounded-l-lg'
                                disabled={page <= 0}
                                onClick={prev}
                            >
                                &lt;
                            </button>
                            <button
                                className='py-2 rounded-none rounded-r-lg'
                                disabled={!quizzes || quizzes.length < 12 || !nextPage}
                                onClick={next}
                            >
                                &gt;
                            </button>
                        </div>)}
                </>
            )}
        </div>
    );
};

export default QuizTable;
