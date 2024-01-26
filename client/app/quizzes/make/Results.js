import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
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
            <h3 className='underlined text-xl font-bold mb-6'>Results*</h3>

            <div className='mt-6 p-3'>
                {quiz.results.map((result, index) => (
                    <div key={index} className='mb-8'>
                        <div className='flex mb-2'>
                            <label className='flex w-full'>
                                <p className='my-auto'>{index + 1}.</p>
                                <input
                                    className='w-full ml-2'
                                    type='text'
                                    maxLength='255'
                                    placeholder='Result Title'
                                    value={result.title}
                                    onChange={(event) => handleTitleChange(event, index)}
                                    required
                                />
                            </label>
                            {quiz.results.length > 2 && (
                                <button
                                    className='py-1 ml-2 w-fit bg-stone-400'
                                    onClick={() => cancelResult(index)}
                                >
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                            )}
                        </div>
                        <textarea
                            className='w-full'
                            maxLength='1000'
                            placeholder='Result Description'
                            value={result.description}
                            onChange={(event) => handleDescriptionChange(event, index)}
                            required
                        />
                    </div>
                ))}
            </div>

            <button onClick={addNewResult}>Add Result</button>
        </div>
    );
};

export default Results;
