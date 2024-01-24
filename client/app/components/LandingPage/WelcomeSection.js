'use client';

import { useRouter } from 'next/navigation';


const WelcomeSection = () => {

    const router = useRouter();

    return (
        <section
            className='text-center pt-16 md:pb-24 pb-16 px-8 flex flex-col md:flex-row'
        >
            <div className='mb-8 md:mb-0 md:mr-20'>
                <h1 className='text-5xl font-bold mb-4'>OxyQuiz</h1>
                <p className='text-xl accent-colored'>
                    Create and browse quizzes in different categories
                </p>
            </div>
            <div className='my-auto'>
                <button
                    className='main-btn px-6 py-3 text-xl font-semibold h-fill'
                    onClick={() => router.push('/quizzes/make')}
                >
                    Make your own quiz
                </button>
            </div>
        </section>
    );
};

export default WelcomeSection;
