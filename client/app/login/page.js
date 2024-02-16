'use client';

import Link from 'next/link';
import LoginForm from './LoginForm';

const LoginPage = () => {

    return (
        <main className='flex flex-col items-center justify-between p-4 md:p-12'>
            <h1 className='mb-3 text-4xl sm:text-6xl font-bold py-12'>Login</h1>
            <LoginForm />
            <div  className='text-center mb-12'>
                <p className='mt-12 mb-2'>Not a user? Register <Link href='/register' className='hover:font-semibold'>here</Link></p>
                <p>Back to the <Link href='/' className='hover:font-semibold'>homepage</Link></p>
            </div>
        </main>
    );
};

export default LoginPage;
