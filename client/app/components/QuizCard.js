import Link from 'next/link';


const QuizCard = (props) => {

    const { quizData } = props;

    return (
        <Link href={`/quizzes/${quizData.id}`}>
            <div className='container flex flex-col h-full flex-auto items-center justify-center my-auto text-center p-6'>
                <div className='underlined pb-4 w-full'>
                    <h1 className='text-2xl font-semibold'>{quizData.title}</h1>
                </div>
                <p className='accent-colored lowercase'>{quizData.category.name}</p>
                {quizData.description && (<h2 className='px-12 pt-8'>{quizData.description}</h2>)}
                <p className='accent-colored pt-6'>by {quizData.creator.username}</p>
                <p className='accent-colored'>{quizData.createdAt.split('T')[0]}</p>
            </div>
        </Link >
    );
};

export default QuizCard;
