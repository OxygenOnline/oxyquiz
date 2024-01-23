import { useQuiz } from './QuizContext';


const Results = () => {

    const { quiz, setQuiz } = useQuiz();

    const handleTitleChange = (event, index) => {
        const newTitle = event.target.value;

        setQuiz((prevQuiz) => {
            const newQuiz = { ...prevQuiz };
            newQuiz.results[index] = {
                ...newQuiz.results[index],
                title: newTitle,
            };

            return newQuiz;
        });
    };

    const handleDescriptionChange = (event, index) => {
        const newDescription = event.target.value;

        setQuiz((prevQuiz) => {
            const newQuiz = { ...prevQuiz };
            newQuiz.results[index] = {
                ...newQuiz.results[index],
                description: newDescription,
            };

            return newQuiz;
        });
    };

    const addNewResult = () => {
        setQuiz((prevQuiz) => {
            const newQuiz = { ...prevQuiz };
            newQuiz.results = [...newQuiz.results,
            { title: '', description: '' }
            ];
            return newQuiz;
        });
    };

    const cancelResult = (index) => {
        setQuiz((prevQuiz) => {
            const newQuiz = {
                ...prevQuiz,
                results: prevQuiz.results.filter((_, i) => i !== index),
            };
            return newQuiz;
        });
    };

    return (
        <div className='container p-3'>
            <h3 className='underlined text-xl font-bold mb-6'>Results</h3>

            <div className='mt-6 p-3'>
                {quiz.results.map((result, index) => (
                    <div key={index} className='mb-8'>
                        <label className='flex mb-2'>
                            <p className='my-auto'>{index + 1}.</p>
                            <input
                                className='w-full ml-2'
                                type='text'
                                placeholder='Result Title'
                                value={result.title}
                                onChange={(event) => handleTitleChange(event, index)}
                            />
                        </label>
                        <textarea
                            className='w-full'
                            placeholder='Result Description'
                            value={result.description}
                            onChange={(event) => handleDescriptionChange(event, index)}
                        />
                        {quiz.results.length > 2 && (
                            <button
                                className='p-1 bg-stone-400 hover:shadow-none'
                                onClick={() => cancelResult(index)}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={addNewResult}>Add Result</button>
        </div>
    );
};

export default Results;
