import React, { createContext, useState, useContext } from 'react';


const QuizContext = createContext();

export const QuizProvider = ({ children, initialData }) => {

    const [quiz, setQuiz] = useState(initialData || {
        title: '',
        description: '',
        categoryId: '',
        results: [
            { title: '', description: '' },
            { title: '', description: '' },
        ],
        questions: [
            {
                content: '',
                singleChoice: true,
                weight: 1,
                options: [
                    { content: '', selectedResults: [] },
                    { content: '', selectedResults: [] },
                ],
            },
            {
                content: '',
                singleChoice: true,
                weight: 1,
                options: [
                    { content: '', selectedResults: [] },
                    { content: '', selectedResults: [] },
                ],
            }
        ]
    });

    return (
        <QuizContext.Provider value={{ quiz, setQuiz }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => {
    return useContext(QuizContext);
};
