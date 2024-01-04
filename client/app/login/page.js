'use client';

import Link from 'next/link';
import LoginForm from './LoginForm';

const LoginPage = () => {

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-12">
            <h1 className="mb-3 text-6xl font-bold p-12">Login</h1>
            <LoginForm />
            <div  className='text-center'>
                <p className="pt-12 pb-2">Not a user? Register <Link href='/register' className='hover:font-semibold'>here</Link></p>
                <p>Back to the <Link href='/' className='hover:font-semibold'>homepage</Link></p>
            </div>
        </main>
    );
};

export default LoginPage;
