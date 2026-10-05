import { createUser, deleteUser, getUser, updateUser } from '../../steps/user/user.js'
import { generateTestData } from '../../utils/helpers.js'

before(async () => {
    await generateTestData()
})

it('CRUD User', () => {
    describe(`CRUD User`, () => {
        createUser()
        getUser()
        updateUser()
        deleteUser()
    })
})
