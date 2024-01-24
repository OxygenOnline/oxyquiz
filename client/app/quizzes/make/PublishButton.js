import { useRouter } from 'next/navigation';
import { useQuiz } from './QuizContext';
import { createQuiz, updateQuiz } from '../../api';


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
                ...option,
                position: optionIndex,
                resultPositions: option.selectedResults,
                selectedResults: undefined
            })),
        }));

        const createdQuiz =
        {
            quiz:
            {
                title: quiz.title,
                description: quiz.description || null,
                categoryId: Number(quiz.categoryId),
                results: mappedResults,
                questions: mappedQuestions
            }
        }

        let response = null;

        if (quiz.id) {
            response = await updateQuiz(quiz.id, createdQuiz);
        }
        else {
            response = await createQuiz(createdQuiz);
        }

        const data = await response.json();
        
        if (response.status === 201 || response.ok) {
            const targetRoute = quiz.id ? `/quizzes/${quiz.id}` : `/quizzes/${data}`;
            router.push(targetRoute);
        }
        else {
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
