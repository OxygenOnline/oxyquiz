import { useRouter } from "next/navigation"
import { useState } from "react"


export default function RegisterForm() {

    async function register() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: state.email,
                    username: state.username,
                    password: state.password,
                }),
            });

            if (response.ok) {
                router.push("/login");
            }
            else {
                const data = await response.json();
                console.log(data)
                setError(data.errors[0].msg || "Registration failed");
            }
        }
        catch (error) {
            console.error("Registration error:", error);
            setError("Registration failed. Please try again.");
        }
    }

    const router = useRouter();

    const [state, setState] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!state.email || !state.username || !state.password || !state.confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (state.password !== state.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        await register();
    }

    return (
        <form className="flex flex-col items-center justify-between">
            {error && (
                <p className="text-red-600 w-full text-center rounded-md p-3 mb-4">{error}</p>
            )}
            <div className="pb-12">
                <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left justify-between">
                    <p className="mb-3 text-2xl">Email:</p>
                    <input
                        type="text"
                        name="email"
                        value={state.email}
                        onChange={handleChange}
                        className="mb-3 text-2xl rounded-lg px-2"
                        required
                    />
                </div>
                <div className="pb-12">
                    <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left justify-between">
                        <p className="mb-3 text-2xl">Username:</p>
                        <input
                            type="text"
                            name="username"
                            value={state.username}
                            onChange={handleChange}
                            className="mb-3 text-2xl rounded-lg px-2"
                            required
                        />
                    </div>
                    <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left justify-between">
                        <p className="mb-3 text-2xl">Password:</p>
                        <input
                            type="password"
                            name="password"
                            value={state.password}
                            onChange={handleChange}
                            className="mb-3 text-2xl rounded-lg px-2"
                            required
                        />
                    </div>
                    <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left justify-between">
                        <p className="mb-3 text-2xl">Confirm Password:</p>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={state.confirmPassword}
                            onChange={handleChange}
                            className="mb-3 text-2xl rounded-lg px-2"
                            required
                        />
                    </div>
                </div>
                <button onClick={handleSubmit} className="mb-3 text-2xl font-semibold group rounded-lg border border-transparent px-10 py-3 transition-colors">Register</button>
            </div>
        </form>
    )
}
