'use client';

import { useRouter } from 'next/navigation';
import { getRandomQuiz } from '../../api';


const RandomSection = () => {

    const router = useRouter();

    const random = async () => {
        const response = await getRandomQuiz();
        const quiz = await response.json();
        router.push(`/quizzes/${quiz.id}`);
    };

    return (
        <section
            className='text-center pt-16 lg:pt-28 pb-8 md:pb-16 px-8 flex flex-col md:flex-row'
        >
            <div className='my-auto mb-8 md:mb-0 md:mr-20'>
                <button
                    className='main-btn px-6 py-3 mb-2 text-xl font-semibold h-fill'
                    onClick={random}
                >
                    Surprise me
                </button>
            </div>
            <div className='my-auto'>
                <h2 className='text-4xl font-bold mb-4'>The Quiz Wizard</h2>
                <p className='text-xl accent-colored'>
                    Find a random quiz. Let fate decide...
                </p>
            </div>
        </section>
    );
};

export default RandomSection;
