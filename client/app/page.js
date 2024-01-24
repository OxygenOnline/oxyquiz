import { getQuizzes } from './api';
import QuizGrid from './components/QuizGrid';
import WelcomeSection from './components/LandingPage/WelcomeSection';
import RandomSection from './components/LandingPage/RandomSection';
import CategorySection from './components/LandingPage/CategorySection';
import RegisterSection from './components/LandingPage/RegisterSection';


const fetchQuizzes = async () => {
    try {
        const response = await getQuizzes();

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
};

const Home = async () => {

    const quizzes = await fetchQuizzes();

    return (
        <main className='flex flex-col items-center justify-between p-8 lg:p-12'>

            <WelcomeSection />

            {quizzes && (
                <section className='text-center pt-12 md:pt-20 md:pb-24 pb-16'>
                    <h2 className='accent-colored text-4xl font-bold mb-12'>Hottest Selection</h2>
                    <QuizGrid quizzes={quizzes} />
                </section>
            )}

            <RandomSection />

            <CategorySection />

            <RegisterSection />

        </main>
    );
};

export default Home;
