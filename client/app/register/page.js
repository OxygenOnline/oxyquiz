'use client';

import Link from 'next/link';
import RegisterForm from './RegisterForm';

const RegisterPage = () => {
  
    return (
        <main className='flex flex-col items-center justify-between p-4 md:p-12'>
            <h1 className='mb-3 text-4xl sm:text-6xl font-bold py-12'>Register</h1>
            <RegisterForm />
            <div className='text-center mb-12'>
                <p className='mt-12 mb-6'>Already a user? Login <Link href='/login' className='hover:font-semibold'>here</Link></p>
                <p>Back to the <Link href='/' className='hover:font-semibold'>homepage</Link></p>
            </div>
        </main>
    );
};

export default RegisterPage;
