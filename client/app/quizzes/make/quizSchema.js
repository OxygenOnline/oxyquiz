import * as yup from 'yup';

const quizSchema = yup.object().shape({
    quiz: yup.object().shape({
        title: yup.string()
            .max(100, 'Quiz Title: maximum 100 characters')
            .matches(/\S+/, 'Missing Quiz Title'),
        description: yup.string().nullable().matches(/\S+/, 'Invalid Quiz Description'),
        categoryId: yup.number().integer().required('Missing Quiz Category'),
        results: yup.array().of(
            yup.object().shape({
                id: yup.number().integer(),
                title: yup.string()
                    .matches(/\S+/, ({ path }) => {
                        const index = Number(path.match(/\[(\d+)\]/)[1]);
                        return `Missing Result ${index + 1} Title`;
                    }),
                description: yup.string().nullable(),
                position: yup.number().integer().required(),
            })
        ).min(2, 'Results: minimum 2'),
        questions: yup.array().of(
            yup.object().shape({
                id: yup.number().integer(),
                content: yup.string()
                    .matches(/\S+/, ({ path }) => {
                        const index = Number(path.match(/\[(\d+)\]/)[1]);
                        return `Missing Question ${index + 1} Title`;
                    }),
                position: yup.number().integer().required(),
                weight: yup.number().positive().required(),
                singleChoice: yup.boolean().required(),
                options: yup.array().of(
                    yup.object().shape({
                        id: yup.number().integer(),
                        content: yup.string()
                            .matches(/\S+/, ({ path }) => {
                                const questionIndex = Number(path.match(/questions\[(\d+)\]/)[1]);
                                const optionIndex = Number(path.match(/options\[(\d+)\]/)[1]);
                                return `Empty Option ${optionIndex + 1} (Question ${questionIndex + 1})`;
                            }),
                        position: yup.number().integer().required(),
                        resultPositions: yup.array().of(
                            yup.number().integer()
                        ).min(1,
                            ({ path }) => {
                                const questionIndex = Number(path.match(/questions\[(\d+)\]/)[1]);
                                const optionIndex = Number(path.match(/options\[(\d+)\]/)[1]);
                                return `Empty Result list in Option ${optionIndex + 1} (Question ${questionIndex + 1})`;
                            }),
                    })
                ).min(2, 'Options: minimum 2'),
            })
        ).min(2, 'Questions: minimum 2'),
    }).required(),
});

export default quizSchema;
