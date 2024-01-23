'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '../../api';
import { QuizProvider } from './QuizContext';
import MetaData from './MetaData';
import Results from './Results';
import Questions from './Questions';
import PublishButton from './PublishButton';


const MakeQuizPage = () => {

    const router = useRouter();

    useEffect(() => {
        const userLoggedIn = async () => {
            try {
                const response = await checkAuth();

                if (response.status === 403) {
                    router.replace('/login');
                }
            }
            catch (error) {
                console.error(error);
            }
        };

        userLoggedIn();
    }, []);

    return (
        <>
            <main className='flex flex-col lg:flex-row m-8 justify-center lg:m-12'>

                <QuizProvider>
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
        </>
    );
};

export default MakeQuizPage;
