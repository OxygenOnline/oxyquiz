import Link from 'next/link';
import getCategoryList from '../data/categories';


const CategorySection = async () => {

    const categories = await getCategoryList();

    return (
        <section className='py-16 mt-16'>
            <div className='container py-12 mx-auto text-center'>
                <h2 className='accent-colored text-4xl font-bold mb-12'>
                    Explore Categories
                </h2>
                <div
                    className='flex flex-wrap justify-center w-5/6 sm:w-4/5 md:w-2/3 lg:w-1/2 mx-auto'
                >
                    <p className='text-lg m-2'>
                        <Link href={'/quizzes/all'} className='hover:font-semibold'>
                            All
                        </Link>
                    </p>
                    {categories?.map((category) => (
                        <p
                            key={category.id}
                            className='text-lg m-2'
                        >
                            <Link
                                href={`/categories/${category.pathName}`}
                                className='hover:font-semibold'
                            >
                                {category.name}
                            </Link>
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
