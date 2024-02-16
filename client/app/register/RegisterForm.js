import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { register } from '../api';


const RegisterForm = () => {

    const router = useRouter();

    const [state, setState] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const submitRegister = async () => {

        const user = {
            email: state.email,
            username: state.username,
            password: state.password,
        };

        try {
            const response = await register(user);

            if (response.ok) {
                router.push('/login');
            }
            else {
                const data = await response.json();
                setError(data.errors[0].msg || 'Registration failed');
            }
        }
        catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please try again.');
        }
    };

    const handleChange = async (e) =>  {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!state.email || !state.username || !state.password || !state.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (state.password !== state.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        await submitRegister();
    };

    return (
        <form className='flex flex-col items-center justify-between w-max-full'>
            {error && (
                <p className='text-red-600 w-full text-center p-3 mb-4'>{error}</p>
            )}
            <div className='pb-12 mb-12'>
                <div className='grid lg:mb-0 lg:grid-cols-2 lg:text-left'>
                    <p className='mb-3 text-l sm:text-2xl'>Email:</p>
                    <input
                        type='text'
                        name='email'
                        value={state.email}
                        onChange={handleChange}
                        className='mb-3 text-l sm:text-2xl px-2'
                        required
                    />
                </div>
                <div className='pb-12'>
                    <div className='grid lg:mb-0 lg:grid-cols-2 lg:text-left'>
                        <p className='mb-3 text-l sm:text-2xl'>Username:</p>
                        <input
                            type='text'
                            name='username'
                            value={state.username}
                            onChange={handleChange}
                            className='mb-3 text-l sm:text-2xl px-2'
                            required
                        />
                    </div>
                    <div className='grid lg:mb-0 lg:grid-cols-2 lg:text-left'>
                        <p className='mb-3 text-l sm:text-2xl'>Password:</p>
                        <input
                            type='password'
                            name='password'
                            value={state.password}
                            onChange={handleChange}
                            className='mb-3 text-l sm:text-2xl px-2'
                            required
                        />
                    </div>
                    <div className='grid lg:mb-0 lg:grid-cols-2 lg:text-left'>
                        <p className='mb-3 text-l sm:text-2xl'>Confirm Password:</p>
                        <input
                            type='password'
                            name='confirmPassword'
                            value={state.confirmPassword}
                            onChange={handleChange}
                            className='mb-3 text-l sm:text-2xl px-2'
                            required
                        />
                    </div>
                </div>
                <button onClick={handleSubmit} className='text-2xl font-semibold py-3'>Register</button>
            </div>
        </form>
    );
};

export default RegisterForm;
