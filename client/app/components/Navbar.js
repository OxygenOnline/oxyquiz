'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faUser, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import SideMenu from "./SideMenu";
import { login } from '../api';


const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState();

    useEffect(() => {
        const value = localStorage.getItem('loggedInUser');
        if (value) {
            setIsLoggedIn(true)
        }
    }, []);

    const handleLogout = async () => {
        try {
            await login();
            localStorage.removeItem('loggedInUser');
            setIsLoggedIn(false);
        }
        catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            <nav className='flex flex-row justify-between'>
                <div className='my-auto'>
                    <button onClick={() => setIsOpen(!isOpen)} className="m1-2 white-colored focus:outline-none">
                        <FontAwesomeIcon icon={faBars} className="text-2xl" />
                    </button>
                </div>

                <div className='my-auto hidden md:block font-semibold tracking-widest text-2xl'>
                    <Link href='/'>oxyquiz</Link>
                </div>

                <div className='flex text-lg my-auto'>
                    <ul className='flex'>
                        {isLoggedIn ? (
                            <>
                                <li className='p-4'>
                                    <Link href='/profile'>
                                        <FontAwesomeIcon icon={faUser} className='md:hidden text-2xl' />
                                        <p className='hidden md:block'>profile</p>
                                    </Link>
                                </li>
                                <li className='p-4'>
                                    <Link href='#' onClick={handleLogout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className='md:hidden text-2xl' />
                                        <p className='hidden md:block'>logout</p>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className='p-4'>
                                <Link href='/login'>
                                    <FontAwesomeIcon icon={faSignInAlt} className='md:hidden text-2xl' />
                                    <p className='hidden md:block'>login</p>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>

            {isOpen && (<SideMenu />)}
        </>
    );
};

export default Navbar;
