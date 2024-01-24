'use client';

import { useRouter } from 'next/navigation';


const RegisterSection = () => {

    const router = useRouter();

    return (
        <section
            className='text-center flex flex-col md:flex-row pt-16 lg:pt-28 pb-8 md:pb-16 px-8'
        >
            <div className='flex flex-col justify-center mb-8 md:mb-0 md:mr-20'>
                <h2 className='text-4xl font-bold mb-4'>Join us!</h2>
                <p className='text-xl accent-colored'>
                    Create an account now and share your quizzes
                </p>
            </div>
            <div className='my-auto'>
                <button
                    className='main-btn px-6 py-3 mb-2 text-xl font-semibold h-fill'
                    onClick={() => router.push('/login')}
                >
                    Login
                </button>
                <button
                    className='main-btn px-6 py-3 text-xl font-semibold h-fill'
                    onClick={() => router.push('/register')}
                >
                    Register
                </button>
            </div>
        </section>
    );
};

export default RegisterSection;
