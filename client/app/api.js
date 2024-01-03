const api = process.env.NEXT_PUBLIC_SERVER_URL;


const register = async (user) => {
    const response = await fetch(`${api}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    return response;
}

const login = async (user) => {
    const response = await fetch(`${api}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    return response;
}

module.exports = {
    register,
    login,
}
