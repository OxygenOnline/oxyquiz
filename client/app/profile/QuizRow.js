'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';
import { deleteQuiz } from '../api';


const QuizRow = ({ quiz }) => {

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const editQuiz = () => {
        location.assign(`/quizzes/make?quizId=${quiz.id}`)
    };

    const confirmDelete = async () => {
        await deleteQuiz(quiz.id);
        setShowConfirmDialog(false);
        location.reload();
    };

    return (
        <>
            <tr key={quiz.id} className='hover:bg-stone-200'>
                <td className='py-1'>
                    <Link href={`/quizzes/${quiz.id}`}>
                        {`[${quiz.id}] ${quiz.title}`}
                    </Link>
                </td>
                <td className='px-2'>
                    <Link href='#' onClick={editQuiz}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Link>
                </td>
                <td className='px-2'>
                    <Link href='#' onClick={() => setShowConfirmDialog(true)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </Link>
                </td>
            </tr>
            {showConfirmDialog && (
                <div
                    className='absolute top-0 left-0 z-10 w-full h-full flex justify-center 
                    rounded-lg items-center bg-stone-900 bg-opacity-50'
                >
                    <div className='bg-white p-4 rounded-lg shadow-md'>
                        <p>Delete "{`[${quiz.id}] ${quiz.title}`}" quiz?</p>
                        <div className='flex justify-center mt-4'>
                            <button
                                className='px-6 py-3 bg-stone-400 hover:shadow-none mr-4 w-fit'
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                            <button
                                className='px-6 py-3 w-fit'
                                onClick={() => setShowConfirmDialog(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuizRow;
