import { useQuiz } from './QuizContext';
import categories from '../../data/categories.json';
import Link from 'next/link';


const MetaData = () => {

    const { quiz, setQuiz } = useQuiz();

    const handleTitleChange = (event) => {
        setQuiz({
            ...quiz,
            title: event.target.value,
        });
    };

    const handleDescriptionChange = (event) => {
        setQuiz({
            ...quiz,
            description: event.target.value,
        });
    };

    const handleCategoryChange = (event) => {
        setQuiz({
            ...quiz,
            categoryId: event.target.value,
        });
    };

    return (
        <div className='container p-3 mb-6'>
            {quiz.id && (
                <div className='underlined'>
                    <Link
                        href={`/quizzes/${quiz.id}`}
                        className='text-xl font-bold accent-colored'
                    >
                        View The Published Quiz
                    </Link>
                </div>
            )}
            < div className='flex flex-col mt-6'>
                <label className='text-xl font-bold'>Quiz Title</label>
                <input
                    className='p-1'
                    type="text"
                    value={quiz.title}
                    onChange={handleTitleChange}
                    required
                />
            </div>
            <div className='flex flex-col mt-6'>
                <label className='text-xl font-bold'>Description</label>
                <textarea
                    className='p-1'
                    value={quiz.description}
                    onChange={handleDescriptionChange}
                />
            </div>
            <div className='flex flex-col mt-6'>
                <label className='text-xl font-bold'>Category</label>
                <select
                    className='py-1'
                    value={quiz.categoryId}
                    onChange={handleCategoryChange}
                    required>
                    <option value=''></option>
                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MetaData;