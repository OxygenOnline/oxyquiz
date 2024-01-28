import * as yup from 'yup';

const quizSchema = yup.object().shape({
    quiz: yup.object().shape({
        title: yup.string()
            .min(6, 'Quiz Title: minimum 6 characters')
            .max(255, 'Quiz Title: maximum 255 characters')
            .matches(/\S+/, 'Missing Quiz Title'),
        description: yup.string()
            .nullable()
            .max(1000, 'Quiz Description: maximum 1000 characters')
            .matches(/\S+/, 'Invalid Quiz Description'),
        categoryId: yup.number().integer().required('Missing Quiz Category'),
        results: yup.array().of(
            yup.object().shape({
                id: yup.number().integer(),
                title: yup.string()
                    .max(255, 'Result Title: maximum 255 characters')
                    .matches(/\S+/, ({ path }) => {
                        const index = Number(path.match(/\[(\d+)\]/)[1]);
                        return `Missing Result ${index + 1} Title`;
                    }),
                description: yup.string()
                    .nullable()
                    .max(1000, 'Result Description: maximum 1000 characters'),
                position: yup.number().integer().required(),
            })
        ).min(2, 'Results: minimum 2')
            .max(100, 'Results: maximum 100'),
        questions: yup.array().of(
            yup.object().shape({
                id: yup.number().integer(),
                content: yup.string()
                    .max(255, 'Question Title: maximum 255 characters')
                    .matches(/\S+/, ({ path }) => {
                        const index = Number(path.match(/\[(\d+)\]/)[1]);
                        return `Missing Question ${index + 1} Title`;
                    }),
                position: yup.number().integer().required(),
                weight: yup.number().positive().max(100).required(),
                singleChoice: yup.boolean().required(),
                options: yup.array().of(
                    yup.object().shape({
                        id: yup.number().integer(),
                        content: yup.string()
                            .max(1000, 'Option Field: maximum 1000 characters')
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
                ).min(2, 'Options: minimum 2')
                    .max(255, 'Options: maximum 255'),
            })
        ).min(2, 'Questions: minimum 2')
            .max(500, 'Questions: maximum 500'),
    }).required(),
});

export default quizSchema;
