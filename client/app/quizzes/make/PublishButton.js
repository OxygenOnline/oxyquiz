import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from './QuizContext';
import { createQuiz, updateQuiz } from '../../api';
import quizSchema from './quizSchema';


const PublishButton = () => {

    const router = useRouter();
    const { quiz } = useQuiz();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const mappedResults = quiz.results.map((result, index) => ({
                ...result,
                position: index,
            }));

            const mappedQuestions = quiz.questions.map((question, index) => ({
                ...question,
                weight: question.weight || 1,
                position: index,
                options: question.options.map((option, optionIndex) => ({
                    ...option,
                    position: optionIndex,
                    resultPositions: option.selectedResults,
                    selectedResults: undefined
                })),
            }));

            const createdQuiz =
            {
                quiz:
                {
                    title: quiz.title,
                    description: quiz.description || null,
                    categoryId: quiz.categoryId ? Number(quiz.categoryId) : null,
                    results: mappedResults,
                    questions: mappedQuestions
                }
            };
            await quizSchema.validate(createdQuiz, { abortEarly: false });

            let response = null;

            if (quiz.id) {
                response = await updateQuiz(quiz.id, createdQuiz);
            }
            else {
                response = await createQuiz(createdQuiz);
            }

            const data = await response.json();

            if (response.status === 201 || response.ok) {
                const targetRoute = quiz.id ? `/quizzes/${quiz.id}` : `/quizzes/${data}`;
                router.push(targetRoute);
            }
        }
        catch (validationError) {
            setError(validationError.errors);
        }
    };

    return (
        <>
            <button
                onClick={handleSubmit}
                className='main-btn text-2xl font-semibold py-3 mt-8'
            >
                publish
            </button>
            {error && (
                <div
                    className='fixed top-0 left-0 z-50 w-screen h-screen
                    flex items-center justify-center'
                >
                    <div
                        className='bg-stone-900 bg-opacity-60 absolute inset-0'
                    >
                    </div>
                    <div
                        className='bg-white w-4/5 md:w-2/3 lg:w-1/3 max-h-screen
                        rounded-lg shadow-lg p-6 text-center relative z-10'
                    >
                        <h2 className='text-red-600 border-b-2 border-red-600 pb-2 text-2xl font-bold'>Error</h2>
                        <ul className='mt-6 overflow-y-auto max-h-72'>
                            {error.map((errorMessage, index) => (
                                <li key={index} className='text-lg font-semibold mt-2'>{errorMessage}</li>
                            ))}
                        </ul>
                        <button
                            className='bg-stone-400 hover:shadow-none font-semibold px-6 py-3 mt-12'
                            onClick={() => setError('')}
                        >
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default PublishButton;
