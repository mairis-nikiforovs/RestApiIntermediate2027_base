export async function generateTestData() {
    global.env = process.env.ENV || 'STG'
}

export async function generateRandomEmail() {
    return `${Math.random().toString(36).substring(2,11)}@domain.com`
}