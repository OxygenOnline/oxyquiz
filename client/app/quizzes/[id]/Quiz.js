'use client';

import { useState } from 'react';
import { getQuizResult } from '../../api';


const Quiz = (props) => {

    const { quizData } = props;
    const [error, setError] = useState('');

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
            setError('')
            alert(data.winningResult.title);
        }
        catch (error) {
            console.error(error);
        }
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
                <p className="text-red-600 w-full text-center p-3 mb-4">{error}</p>
            )}
            <button onClick={handleSubmit} className='text-2xl font-semibold py-3'>results</button>
        </div>
    );
};

export default Quiz;
