import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useQuiz } from './QuizContext';


const Questions = () => {

    const { quiz, setQuiz } = useQuiz();

    const handleQuestionTitleChange = (event, index) => {
        const newTitle = event.target.value;

        setQuiz((prevQuiz) => {
            const newQuiz = { ...prevQuiz };
            newQuiz.questions[index] = {
                ...newQuiz.questions[index],
                content: newTitle,
            };

            return newQuiz;
        });
    };

    const handleSingleChoiceChange = (event, index) => {
        const isChecked = event.target.checked;

        setQuiz((prevQuiz) => {
            const newQuiz = { ...prevQuiz };
            newQuiz.questions[index] = {
                ...newQuiz.questions[index],
                singleChoice: isChecked,
            };

            return newQuiz;
        });
    };

    const handleWeightChange = (event, index) => {
        const weight = parseInt(event.target.value);

        setQuiz((prevQuiz) => {
            const newQuiz = { ...prevQuiz };
            newQuiz.questions[index] = {
                ...newQuiz.questions[index],
                weight,
            };

            return newQuiz;
        });
    };

    const handleOptionChange = (event, questionIndex, optionIndex) => {
        const newContent = event.target.value;

        setQuiz((prevQuiz) => {
            const newQuiz = { ...prevQuiz };
            newQuiz.questions[questionIndex].options[optionIndex] = {
                ...newQuiz.questions[questionIndex].options[optionIndex],
                content: newContent,
            };

            return newQuiz;
        });
    };

    const handleResultSelection = (event, questionIndex, optionIndex) => {
        const resultIndex = Number(event.target.value);
        setQuiz((prevQuiz) => {
            return {
                ...prevQuiz,
                questions: prevQuiz.questions.map((question, qIndex) => {
                    if (qIndex === questionIndex) {
                        const newOptions = question.options.map((option, oIndex) => {
                            if (oIndex === optionIndex) {
                                const isSelected = option.selectedResults.includes(resultIndex);
                                const newSelectedResults = isSelected
                                    ? option.selectedResults.filter((index) => index !== resultIndex)
                                    : [...option.selectedResults, resultIndex];

                                return {
                                    ...option,
                                    selectedResults: newSelectedResults,
                                };
                            }
                            return option;
                        });
                        return {
                            ...question,
                            options: newOptions,
                        };
                    }
                    return question;
                }),
            };
        });
    };

    const addNewQuestion = () => {
        setQuiz((prevQuiz) => {
            const newQuiz = { ...prevQuiz };
            newQuiz.questions = [...newQuiz.questions, {
                content: '',
                singleChoice: true,
                weight: 1,
                options: [
                    { content: '', selectedResults: [] },
                    { content: '', selectedResults: [] },
                ],
            },];
            return newQuiz;
        });
    };

    const addNewOption = (questionIndex) => {
        setQuiz((prevQuiz) => {
            const newQuiz = JSON.parse(JSON.stringify(prevQuiz));
            newQuiz.questions[questionIndex] = {
                ...newQuiz.questions[questionIndex],
                options: [
                    ...newQuiz.questions[questionIndex].options,
                    { content: '', selectedResults: [] }
                ],
            };

            return newQuiz;
        });
    };

    const cancelQuestion = (index) => {

        setQuiz((prevQuiz) => {
            const newQuiz = {
                ...prevQuiz,
                questions: prevQuiz.questions.filter((_, i) => i !== index),
            };
            return newQuiz;
        });
    };

    const cancelOption = (questionIndex, optionIndex) => {

        setQuiz((prevQuiz) => {
            return {
                ...prevQuiz,
                questions: prevQuiz.questions.map((question, qIndex) =>
                    qIndex === questionIndex
                        ? {
                            ...question,
                            options: question.options.filter((_, oIndex) => oIndex !== optionIndex)
                        }
                        : question
                )
            };
        });
    };

    return (
        <div className='container h-fit p-6'>
            <h3 className='underlined text-2xl font-bold'>Questions*</h3>

            <div className='mt-6 sm:p-3 p-0'>
                {quiz.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className='mb-12'>

                        <div className='flex flex-col sm:justify-between mb-6'>
                            <div className='flex mb-3 mb-2'>
                                <label className='flex w-full'>
                                    <p className='my-auto'>{questionIndex + 1}.</p>
                                    <input
                                        className='w-full ml-2'
                                        type='text'
                                        maxLength='255'
                                        placeholder='Question Title'
                                        value={question.content}
                                        onChange={(event) =>
                                            handleQuestionTitleChange(event, questionIndex)
                                        }
                                        required
                                    />
                                </label>
                                {quiz.questions.length > 2 && (
                                    <button
                                        className='py-1 w-fit ml-2 bg-stone-400 hover:shadow-none'
                                        onClick={() => cancelQuestion(questionIndex)}
                                    >
                                        <FontAwesomeIcon icon={faX} className='sm:hidden' />
                                        <p className='hidden sm:block'>Cancel</p>
                                    </button>
                                )}
                            </div>
                            <div className='flex justify-between items-center sm:justify-start'>
                                <label className='mr-6'>
                                    <input
                                        className='mr-2'
                                        type='checkbox'
                                        checked={question.singleChoice}
                                        onChange={(event) =>
                                            handleSingleChoiceChange(event, questionIndex)
                                        }
                                        required
                                    />
                                    Single Choice
                                </label>

                                <label>
                                    <input
                                        className='max-w-14 max-h-6 mr-2 py-0'
                                        type='number'
                                        min='1'
                                        max='100'
                                        value={question.weight}
                                        onChange={(event) =>
                                            handleWeightChange(event, questionIndex)
                                        }
                                        required
                                    />
                                    Weight
                                </label>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex}
                                    className='flex flex-col md:flex-row w-full mb-8 items-start'
                                >
                                    <div className='flex flex-row w-full md:basis-1/2 flex-initial mb-2 md:mb-0 md:mr-5'>
                                        {question.options.length > 2 && (
                                            <button
                                                className='py-1 mr-2 w-fit h-fit bg-stone-400 hover:shadow-none'
                                                onClick={() => cancelOption(questionIndex, optionIndex)}
                                            >
                                                <FontAwesomeIcon icon={faX} />
                                            </button>
                                        )}
                                        <textarea
                                            maxLength='1000'
                                            placeholder={`Option ${optionIndex + 1}`}
                                            value={option.content}
                                            className='flex-1'
                                            onChange={(event) =>
                                                handleOptionChange(
                                                    event,
                                                    questionIndex,
                                                    optionIndex
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <select
                                        multiple={true}
                                        value={option.selectedResults}
                                        className='w-full md:basis-1/2'
                                        onChange={(event) =>
                                            handleResultSelection(
                                                event,
                                                questionIndex,
                                                optionIndex
                                            )
                                        }
                                        required
                                    >
                                        {quiz.results.map((result, index) => (
                                            <option
                                                key={index}
                                                value={index}
                                                className='checked:bg-stone-400'
                                            >
                                                {`[${index + 1}] ${result.title}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            <button
                                className='max-w-fit px-6'
                                onClick={() => addNewOption(questionIndex)}
                            >
                                Add Option
                            </button>
                        </div>
                    </div>
                ))}

                <button onClick={addNewQuestion}>Add Question</button>
            </div>
        </div>
    );
};

export default Questions;
