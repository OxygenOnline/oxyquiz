const api = process.env.NEXT_PUBLIC_SERVER_URL;


const register = async (user) => {
    const response = await fetch(`${api}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });
    return response;
};

const login = async () => {
    const response = await fetch(`${api}/users/logout`, {
        method: 'GET',
        credentials: 'include',
    });
    return response;
};

const logout = async (user) => {
    const response = await fetch(`${api}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    return response;
};

const getQuizById = async (quizId) => {
    const response = await fetch(`${api}/quizzes/${quizId}`,
        { method: 'GET' });
    return response;
};

const getQuizResult = async (quizId, answers) => {
    const response = await fetch(`${api}/quizzes/${quizId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers)
    });
    return response;
};


module.exports = {
    register,
    login,
    logout,
    getQuizById,
    getQuizResult
};
