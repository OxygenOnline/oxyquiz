import QuizCard from "./QuizCard";


const QuizGrid = ({ quizzes }) => {

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {quizzes && quizzes.length > 0 && (
                quizzes.map((quiz, index) => (
                    <QuizCard key={index} quizData={quiz} />
                ))
            )}
        </div>
    );
};

export default QuizGrid;
