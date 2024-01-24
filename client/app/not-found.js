import Link from 'next/link';

const NotFound = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-4xl font-bold mb-4'>Not Found</h1>
            <p className='text-lg mb-8'>Could not find the requested resource</p>
            <Link href="/">
                <button className='w-80'>Return Home</button>
            </Link>
        </div>
    );
};

export default NotFound;
