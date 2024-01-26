import { useRouter } from 'next/navigation';


const CancelButton = () => {

    const router = useRouter();

    return (
        <button
            className='bg-stone-400 font-semibold mb-6'
            onClick={() => router.back()}
        >
            Cancel
        </button>
    );
};

export default CancelButton;
