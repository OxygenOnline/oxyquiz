'use client';

import { useState } from 'react';
import { getQuizResult } from '../../api';


const Quiz = (props) => {

    const { quizData } = props;
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const renderOptions = (options, singleChoice, questionIndex) => {
        return options.map((option, index) => (
            <div key={index} className='m-2'>
                <input type={singleChoice ? 'radio' : 'checkbox'}
                    name={`${questionIndex}`}
                    value={option.id}
                    className='mr-1'
                />
                <label>{option.content}</label>
            </div>
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = document.getElementById('answersForm');
        const formData = new FormData(form);

        const questionOptionsMap = {};
        for (const pair of formData.entries()) {
            const questionId = pair[0];
            const optionId = pair[1];

            if (!questionOptionsMap[questionId]) {
                questionOptionsMap[questionId] = [parseInt(optionId)];
            }
            else {
                questionOptionsMap[questionId].push(parseInt(optionId));
            }
        }

        const answerArray = Object.keys(questionOptionsMap).map((questionId) => ({
            questionId: parseInt(questionId),
            optionIds: questionOptionsMap[questionId],
        }));

        const answeredQuestionIds = answerArray.map((answer) => answer.questionId);
        const allQuestionIds = quizData.questions.map((question) => question.id);
        const unansweredQuestionIds = allQuestionIds.filter(
            (questionId) => !answeredQuestionIds.includes(questionId)
        );

        if (unansweredQuestionIds.length !== 0) {
            setError('Please fill in all fields');
            return;
        }

        const answers = { answers: answerArray };

        try {
            const response = await getQuizResult(quizData.id, answers);

            if (!response.ok) {
                throw new Error('Failed to get result');
            }

            const data = await response.json();
            setError('');
            setResult(data);
        }
        catch (error) {
            console.error(error);
        }
    };

    const closeResult = () => {
        document.getElementById('answersForm').reset();
        setResult(null);
    };

    return (
        <div className='flex flex-col grow'>
            <form id="answersForm" className='container mb-12 p-6'>
                {quizData.questions.map((question, index) => (
                    <div key={index} className='p-1'>
                        <h2 className='underlined text-xl mb-2 pb-2'>{question.content}</h2>
                        <div className='mt-3 mb-6'>
                            {renderOptions(question.options, question.singleChoice, question.id)}
                        </div>
                    </div>
                ))}
            </form>
            {error && (
                <p className='text-red-600 w-full text-center p-3 mb-4'>{error}</p>
            )}
            <button onClick={handleSubmit} className='main-btn text-2xl font-semibold py-3'>results</button>
            {result && (
                <div
                    className="fixed top-0 left-0 z-50 w-screen h-screen
                    flex items-center justify-center"
                >
                    <div
                        className="bg-stone-900 bg-opacity-60 absolute inset-0"
                    >
                    </div>
                    <div
                        className="bg-white w-4/5 md:w-2/3 lg:w-1/3
                        rounded-lg shadow-lg p-6 text-center relative z-10"
                    >
                        <h2 className='accent-colored underlined pb-2 text-2xl font-bold'>Your Result</h2>
                        <h3 className="text-2xl font-bold mt-8">{result.title}</h3>
                        {result.description && (
                            <p className="text-base">{result.description}</p>
                        )}
                        <button
                            className='main-btn px-6 py-3 mt-12'
                            onClick={closeResult}
                        >
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
