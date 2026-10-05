export const config = {
    STG: {
        host: process.env.HOST_STG,
        token: process.env.TOKEN_STG,
        username: 'Tenali Ramakrishna',
        gender: 'male',
        status: 'active'
    },
    PROD: {
        host: process.env.HOST_PROD,
        token: process.env.TOKEN_PROD,
        username: 'Tenali Ramakrishna',
        gender: 'male',
        status: 'active'
    }
}

global.executionVariables = {}