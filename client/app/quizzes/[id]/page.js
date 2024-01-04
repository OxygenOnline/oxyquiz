'use client';

import { useEffect, useState } from 'react';
import { getOneQuiz, getQuizResult } from '../../api';


const QuizPage = ({ params }) => {

    const [quizData, setQuizData] = useState(null);

    const fetchQuiz = async () => {
        try {
            const response = await getOneQuiz(params.id);

            if (!response.ok) {
                throw new Error('Failed to get the quiz');
            }

            const data = await response.json();
            setQuizData(data);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [params.id]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        const form = document.getElementById('answersForm');
        const formData = new FormData(form);

        const questionOptionsMap = {};
        for (let pair of formData.entries()) {
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

        const answers = { answers: answerArray };

        try {
            const response = await getQuizResult(params.id, answers);

            if (!response.ok) {
                throw new Error('Failed to get result');
            }

            const data = await response.json();
            alert(data.winningResult.title);
        }
        catch (error) {
            console.error(error);
        }
    };

    const renderOptions = (options, singleChoice, questionIndex) => {

        if (singleChoice) {
            return options.map((option, index) => (
                <div key={index} className='m-2'>
                    <input type='radio'
                        name={`${questionIndex}`}
                        value={option.id}
                        className='mr-1'
                    />
                    <label>{option.content}</label>
                </div>
            ));
        }
        else {
            return options.map((option, index) => (
                <div key={index} className='m-2'>
                    <input type='checkbox'
                        name={`${questionIndex}`}
                        value={option.id}
                        className='mr-1'
                    />
                    <label>{option.content}</label>
                </div>
            ));
        }
    };

    return (
        <>
            <div className='flex flex-col md:flex-row my-12 mx-6'>
                {quizData && (
                    <div className='container flex-1 h-fit text-center mr-12 mb-6 p-6'>
                        <h1 className='underlined text-2xl font-semibold pb-4'>{quizData.title}</h1>
                        <p className='accent-colored'>{quizData.category.name}</p>
                        {quizData.description && (<h2 className='px-12 pt-8'>{quizData.description}</h2>)}
                        <p className='accent-colored pt-6'>by {quizData.creator.username}</p>
                        <p className='accent-colored' >{quizData.createdAt.split('T')[0]}</p>
                    </div>
                )}
                <div className='flex flex-col grow'>
                    {quizData && (
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
                    )}
                    <button onClick={handleSubmit} className='text-2xl font-semibold py-3'>results</button>
                </div>
            </div>
        </>
    );
};

export default QuizPage;
