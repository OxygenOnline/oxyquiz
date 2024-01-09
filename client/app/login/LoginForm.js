import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '../api';


const LoginForm = () => {

    const router = useRouter();

    const [state, setState] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState('');
    
    const submitLogin = async () => {

        const user = state;

        try {
            const response = await login(user);

            if (response.ok) {
                router.push('/');
            }
            else {
                const data = await response.json();
                setError(data.errors[0].msg || 'Login failed');
            }
        }
        catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please try again.');
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

        if (!state.username || !state.password) {
            setError('Please fill in all fields');
            return;
        }

        await submitLogin(state);
    };

    return (
        <form className="flex flex-col items-center justify-between">
            {error && (
                <p className="text-red-600 w-full text-center p-3 mb-4">{error}</p>
            )}
            <div className="pb-12 mb-12">
                <div className="grid lg:mb-0 lg:grid-cols-2 lg:text-left">
                    <p className="mb-3 text-2xl">Username:</p>
                    <input
                        type="text"
                        name="username"
                        value={state.username}
                        onChange={handleChange}
                        className="mb-3 text-2xl px-2"
                        required
                    />
                </div>
                <div className="grid lg:mb-0 lg:grid-cols-2 lg:text-left">
                    <p className="mb-3 text-2xl">Password:</p>
                    <input
                        type="password"
                        name="password"
                        value={state.password}
                        onChange={handleChange}
                        className="mb-3 text-2xl px-2"
                        required
                    />
                </div>
            </div>
            <button onClick={handleSubmit} className="text-2xl font-semibold px-10 py-3">Login</button>
        </form>

    );
};

export default LoginForm;
