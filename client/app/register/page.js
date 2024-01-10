'use client';

import Link from 'next/link';
import RegisterForm from './RegisterForm';

const RegisterPage = () => {
  
    return (
        <main className="flex flex-col items-center justify-between p-12">
            <h1 className="mb-3 text-6xl font-bold p-12">Register</h1>
            <RegisterForm />
            <div className='text-center'>
                <p className="pt-12 pb-2">Already a user? Login <Link href='/login' className='hover:font-semibold'>here</Link></p>
                <p>Back to the <Link href='/' className='hover:font-semibold'>homepage</Link></p>
            </div>
        </main>
    );
};

export default RegisterPage;
