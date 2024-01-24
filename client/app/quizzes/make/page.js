'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth, getFullQuizById } from '../../api';
import { QuizProvider } from './QuizContext';
import MetaData from './MetaData';
import Results from './Results';
import Questions from './Questions';
import PublishButton from './PublishButton';


const MakeQuizPage = ({ searchParams }) => {

    const router = useRouter();
    const quizId = searchParams['quizId'];
    const [quizData, setQuizData] = useState(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState();


    useEffect(() => {
        const userLoggedIn = async () => {
            try {
                const response = await checkAuth();

                if (response.ok) {
                    setIsLoggedIn(true);
                }
                else {
                    setIsLoggedIn(false);
                    router.replace('/login');
                }
            }
            catch (error) {
                console.error(error);
            }
        };

        const getFullQuiz = async (quizId) => {
            try {
                const response = await getFullQuizById(quizId);

                if (response.status === 403) {
                    router.replace('/');
                    return;
                }

                const data = await response.json();
                setQuizData(data);
            }
            catch (error) {
                console.error(error);
            }
        };

        userLoggedIn();

        if (quizId) {
            getFullQuiz(quizId);
        }
        else {
            setQuizData(null);
        }

    }, [searchParams]);

    return (
        <>
            {isLoggedIn && quizData !== undefined && (
                <main className='flex flex-col lg:flex-row m-8 justify-center lg:m-12'>
                    <QuizProvider initialData={quizData}>
                        <div className='flex flex-col basis-1/3 lg:mr-8 mb-8 lg:mb-0'>
                            <MetaData />
                            <Results />
                        </div>

                        <div className='flex flex-col basis-2/3'>
                            <Questions />
                            <PublishButton />
                        </div>
                    </QuizProvider>
                </main >
            )}
        </>
    );
};

export default MakeQuizPage;
