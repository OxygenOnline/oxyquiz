import Link from "next/link";


const categories = [{
    id: 1,
    name: 'Personality',
    pathName: 'personality'
},
{
    id: 2,
    name: 'Movies & TV Shows',
    pathName: 'movies-and-tv-shows'
},
{
    id: 3,
    name: 'Animes & Mangas',
    pathName: 'animes-and-mangas'
},
{
    id: 4,
    name: 'Music',
    pathName: 'music'
},
{
    id: 5,
    name: 'Books',
    pathName: 'books'
},
{
    id: 6,
    name: 'Video Games',
    pathName: 'video-games'
},
{
    id: 7,
    name: 'Food & Drinks',
    pathName: 'food-and-drinks'
},
{
    id: 8,
    name: 'Animals',
    pathName: 'animals'
},
{
    id: 9,
    name: 'Science & Tech',
    pathName: 'science-and-tech'
},
{
    id: 10,
    name: 'Education & Career',
    pathName: 'education-and-career'
},
{
    id: 11,
    name: 'Beauty',
    pathName: 'beauty'
},
{
    id: 12,
    name: 'Fantasy',
    pathName: 'fantasy'
},
{
    id: 13,
    name: 'Other',
    pathName: 'other'
}];

const SideMenu = () => {

    return (
        <div className="sidebar px-2 md:fixed md:w-fit md:h-fit z-50 w-auto h-auto relative static">
            <ul className="p-2 flex flex-col items-start text-lg">
                <li key={0} className="p-2">
                    <Link href='/' className="category">All</Link>
                </li>
                {categories.map((category) => (
                    <li key={category.id} className="p-2">
                        <Link href={`/categories/${category.pathName}`} className="category">{category.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideMenu;
