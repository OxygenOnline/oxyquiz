'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileData from "./ProfileData";
import { getUserData, getUserQuizzes } from '../api';
import QuizTable from './QuizTable';


const ProfilePage = ({ searchParams }) => {

  const router = useRouter();

  const page = searchParams['page'] ?? '0';

  const [profileData, setProfileData] = useState(null);
  const [quizzes, setQuizzes] = useState(null);

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await getUserData();

        if (response.status === 403) {
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

        if (response.status === 403) {
          router.push('/login')
          return;
        }

        const data = await response.json();
        setQuizzes(data);
      }
      catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
    fetchUserQuizzes();
  }, [searchParams]);

  return (
    <>
      <main className='flex flex-col lg:flex-row m-8 justify-center lg:m-12'>
        <div className='flex flex-1 basis-1/3 lg:mr-6 basis-1/3 mb-8 lg:mb-0'>
          <ProfileData profile={profileData} />
        </div>
        <div className='flex flex-col grow basis-2/3'>
          <QuizTable quizzes={quizzes} />
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
            className='main-btn text-2xl font-semibold py-3'
          >
            homepage
          </button>
        </div>
      </main >
    </>
  );
};

export default ProfilePage;
