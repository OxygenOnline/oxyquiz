import Link from 'next/link';


const QuizCard = (props) => {

    const { quizData } = props;

    return (
        <div className='container h-fit flex-1 text-center p-6'>
            <Link href={`/quizzes/${quizData.id}`}>
                <h1 className='underlined text-2xl font-semibold pb-4'>{quizData.title}</h1>
            </Link>
            <Link href={`/categories/${quizData.category.pathName}`} className='accent-colored lowercase'>
                {quizData.category.name}
            </Link>
            {quizData.description && (<h2 className='px-12 pt-8'>{quizData.description}</h2>)}
            <p className='accent-colored pt-6'>by {quizData.creator.username}</p>
            <p className='accent-colored' >{quizData.createdAt.split('T')[0]}</p>
        </div>
    );
};

export default QuizCard;
