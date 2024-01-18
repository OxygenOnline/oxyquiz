'use client';

import QuizRow from './QuizRow';


const QuizTable = ({ quizzes }) => {

    return (
        <div className='container flex min-h-40 py-6 items-center justify-center mb-12'>
            {!quizzes || quizzes.length === 0 ? (
                <p className='text-center text-xl font-semibold'>No quizzes available</p>
            ) : (
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
            )}
        </div>
    );
};

export default QuizTable;
