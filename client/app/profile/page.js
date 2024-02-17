'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileData from './ProfileData';
import { getUserData, getUserQuizNumber, getUserQuizzes } from '../api';
import QuizTable from './QuizTable';


const ProfilePage = ({ searchParams }) => {

    const router = useRouter();

    const page = searchParams['page'] ?? '0';

    const [profileData, setProfileData] = useState(null);
    const [quizzes, setQuizzes] = useState(null);
    const [nextPage, setNextPage] = useState(false);

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await getUserData();

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                const data = await response.json();
                setProfileData(data);
            }
            catch (error) {
                console.error(error);
            }
        };

        const fetchUserQuizzes = async () => {
            try {
                const response = await getUserQuizzes(page);

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                const data = await response.json();
                setQuizzes(data);
            }
            catch (error) {
                console.error(error);
            }
        };

        const isNavigationAllowed = async () => {
            try {
                const response = await getUserQuizNumber();

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                const numberOfQuizzes = await response.json();
                const totalPages = Math.ceil(numberOfQuizzes / 12);
                const nextPageDisabled = (Number(page) + 1) === totalPages;
                setNextPage(!nextPageDisabled);
            }
            catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
        fetchUserQuizzes();
        isNavigationAllowed();
    }, [searchParams]);

    return (
        <>
            {profileData && (
                <main className='flex flex-col lg:flex-row m-8 justify-center lg:m-12'>
                    <div className='flex flex-1 basis-1/3 lg:mr-6 basis-1/3 mb-8 lg:mb-0'>
                        <ProfileData profile={profileData} />
                    </div>
                    <div className='flex flex-col grow basis-2/3'>
                        <QuizTable quizzes={quizzes} nextPage={nextPage} />
                        <button
                            onClick={() => {
                                router.push('/quizzes/make');
                            }}
                            className='main-btn text-2xl font-semibold py-3 mb-6'
                        >
                            create new quiz
                        </button>
                        <button
                            onClick={() => {
                                router.push('/');
                            }}
                            className='bg-stone-400 text-2xl font-semibold py-3'
                        >
                            homepage
                        </button>
                    </div>
                </main >
            )}
        </>
    );
};

export default ProfilePage;
