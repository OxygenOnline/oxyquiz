import { useRouter } from 'next/navigation';
import { useQuiz } from './QuizContext';
import { createQuiz } from '../../api';


const PublishButton = () => {

    const router = useRouter();
    const { quiz } = useQuiz();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const mappedResults = quiz.results.map((result, index) => ({
            ...result,
            position: index,
        }));

        const mappedQuestions = quiz.questions.map((question, index) => ({
            ...question,
            position: index,
            options: question.options.map((option, optionIndex) => ({
                content: option.content,
                position: optionIndex,
                resultPositions: option.selectedResults
            })),
        }));

        const createdQuiz =
        {
            quiz:
            {
                title: quiz.title,
                description: quiz.description || null,
                categoryId: Number(quiz.category),
                results: mappedResults,
                questions: mappedQuestions
            }
        }

        const response = await createQuiz(createdQuiz);
        
        if (response.status === 201) {
            const data = await response.json();
            router.push(`/quizzes/${data}`);
        }
        else {
            const data = await response.json();
            console.error(data)
        }
    };

    return (
        <button
            onClick={handleSubmit}
            className='main-btn text-2xl font-semibold py-3 mt-8'
        >
            publish
        </button>
    );
};

export default PublishButton;
