import { useState, useEffect } from 'react';
import Link from 'next/link';
import getCategoryList from '../data/categories';


const SideMenu = () => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const setCategoryData = async () => {
            try {
                const data = await getCategoryList();
                setCategories(data);
            }
            catch (error) {
                console.error(error);
            }
        };

        setCategoryData();
    }, []);

    return (
        <div className='sidebar px-2 md:fixed md:w-fit md:h-full z-50 w-auto h-auto relative static'>
            <ul className='p-2 flex flex-col items-start text-lg'>
                <li key={0} className='p-2'>
                    <Link href='/quizzes/all' className='category'>All</Link>
                </li>
                {categories?.map((category) => (
                    <li key={category.id} className='p-2'>
                        <Link href={`/categories/${category.pathName}`} className='category'>{category.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideMenu;
