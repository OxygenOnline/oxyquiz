'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faSignOutAlt, faSignInAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import SideMenu from './SideMenu';
import { logout, checkAuth } from '../api';


const Navbar = () => {

    const router = useRouter();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState();

    useEffect(() => {
        const userLoggedIn = async () => {
            try {
                const response = await checkAuth();

                if (response.ok) {
                    setIsLoggedIn(true);
                }
                else {
                    setIsLoggedIn(false);
                }
            }
            catch (error) {
                console.error(error);
            }
        };

        userLoggedIn();
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false);
            router.push('/');
        }
        catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            <nav className='flex flex-row justify-between'>
                <div className='my-auto flex text-lg sm:text-2xl'>
                    <ul className='flex my-auto'>
                        <li className='sm:p-4 p-2'>
                            <Link href='#' onClick={() => setIsOpen(!isOpen)}>
                                <FontAwesomeIcon icon={faBars} className='white-colored' />
                            </Link>
                        </li>
                        {isLoggedIn &&
                            (
                                <li className='sm:p-4 p-2'>
                                    <Link href='/quizzes/make'>
                                        <FontAwesomeIcon icon={faPlus} className='white-colored' />
                                    </Link>
                                </li>

                            )
                        }
                    </ul>
                </div>

                <div className='my-auto font-semibold sm:tracking-widest text-xl sm:text-3xl'>
                    <Link href='/'>oxyquiz</Link>
                </div>

                <div className='flex text-lg sm:text-2xl my-auto'>
                    <ul className='flex my-auto'>
                        {isLoggedIn ? (
                            <>
                                <li className='sm:p-4 p-2'>
                                    <Link href='/profile'>
                                        <FontAwesomeIcon icon={faUser} className='md:hidden sm:text-2xl' />
                                        <p className='hidden md:block'>profile</p>
                                    </Link>
                                </li>
                                <li className='sm:p-4 p-2'>
                                    <Link href='#' onClick={handleLogout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className='md:hidden sm:text-2xl' />
                                        <p className='hidden md:block'>logout</p>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className='sm:p-4 p-2'>
                                <Link href='/login'>
                                    <FontAwesomeIcon icon={faSignInAlt} className='md:hidden sm:text-2xl' />
                                    <p className='hidden md:block'>login</p>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav >

            {isOpen && (<SideMenu />)
            }
        </>
    );
};

export default Navbar;
