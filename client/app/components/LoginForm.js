import { useRouter } from "next/navigation"
import { useState } from "react"


export default function LoginForm() {

    async function login() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: state.username,
                    password: state.password,
                }),
            });

            if (response.ok) {
                router.push("/");
            }
            else {
                const data = await response.json();
                console.log(data)
                setError(data.errors[0].msg || "Registration failed");
            }
        }
        catch (error) {
            console.error("Login error:", error);
            setError("Login failed. Please try again.");
        }
    }

    const router = useRouter();

    const [state, setState] = useState({
        username: "",
        password: "",
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
        
        if (!state.username || !state.password) {
            setError("Please fill in all fields");
            return;
        }

        await login(state);
    }

    return (
        <form className="flex flex-col items-center justify-between">
            {error && (
                <p className="text-red-600 w-full text-center rounded-md p-3 mb-4">{error}</p>
            )}
            <div className="pb-12">
                <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left justify-between">
                    <p className="mb-3 text-2xl">Username:</p>
                    <input
                        type="text"
                        name="username"
                        value={state.username}
                        onChange={handleChange}
                        className="mb-3 text-2xl rounded-lg  px-2"
                        required
                    />
                </div>
                <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
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
            </div>
            <button onClick={handleSubmit} className="mb-3 text-2xl font-semibold group rounded-lg border border-transparent px-10 py-3 transition-colors">Login</button>
        </form>

    )
}
