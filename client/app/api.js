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

const login = async (user) => {
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

const logout = async () => {
    const response = await fetch(`${api}/users/logout`, {
        method: 'GET',
        credentials: 'include',
    });
    return response;
};

const checkAuth = async () => {
    const response = await fetch(`${api}/users/check-auth`, {
        method: 'GET',
        credentials: 'include',
    });
    return response;
};

const getQuizzes = async (page = 0, limit = 6) => {
    const offset = limit * page;
    const response = await fetch(`${api}/quizzes?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache, max-age=120, must-revalidate',
        }
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

const getRandomQuiz = async () => {
    const response = await fetch(`${api}/quizzes/random`,
        { method: 'GET' });
    return response;
};

const getCategoryQuizzes = async (categoryName, page, limit = 6) => {
    const offset = limit * page;
    const response = await fetch(`${api}/quizzes/${categoryName}?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache, max-age=120, must-revalidate',
        }
    });
    return response;
};

const getRandomQuizByCategory = async (categoryName) => {
    const response = await fetch(`${api}/quizzes/${categoryName}/random`,
        { method: 'GET' });
    return response;
};

const getUserData = async () => {
    const response = await fetch(`${api}/users/profile-data`, {
        method: 'GET',
        credentials: 'include',
    });
    return response;
};

const getUserQuizzes = async (page, limit = 12) => {
    const offset = limit * page;
    const response = await fetch(`${api}/quizzes/current?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        credentials: 'include',
    });
    return response;
};

const createQuiz = async (quiz) => {
    const response = await fetch(`${api}/quizzes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quiz)
    });
    return response;
};

const deleteQuiz = async (quizId) => {
    const response = await fetch(`${api}/quizzes/${quizId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    console.log(response.status)
    return response;
};

const updateQuiz = async (quizId, quiz) => {
    const response = await fetch(`${api}/quizzes/${quizId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quiz)
    });
    return response;
};


module.exports = {
    register,
    login,
    logout,
    checkAuth,
    getQuizzes,
    getQuizById,
    getQuizResult,
    getRandomQuiz,
    getCategoryQuizzes,
    getRandomQuizByCategory,
    getUserData,
    getUserQuizzes,
    createQuiz,
    deleteQuiz,
    updateQuiz
};
