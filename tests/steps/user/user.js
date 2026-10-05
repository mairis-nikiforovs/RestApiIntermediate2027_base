import { request } from '../../utils/requests.js'
import { getCreateUserRequestBody, getUpdateUserRequestBody } from '../../utils/requestBodyGenerator/customer.js'
import { config } from '../../../config.js'

export async function createUser() {
    it('Create user account', async function () {
        const requestBody = await getCreateUserRequestBody()
        await request(this, 'POST', '/users', requestBody, true, 
            {
                statusCode : 201,
                expectedFields: ['email'],
                expectedValues: [
                                    {path: 'name', value: requestBody.name},
                                    {path: 'gender', value: requestBody.gender},
                                    {path: 'status', value: requestBody.status}
                                ],
                executionVariables: [
                                        {path: 'id', name: 'userId'}, 
                                    ]
            }
        )
    })
}

export async function deleteUser() {
    it('Remove user account', async function () {
        await request(this, 'DELETE', `/users/${global.executionVariables['userId']}`, undefined, true, 
            {
                statusCode : 204
            }
        )
    })
}

export async function getUser() {
    it('Get user account', async function () {
        await request(this, 'GET', `/users/${global.executionVariables['userId']}`, undefined, true, 
            {
                statusCode : 200,
                expectedFields: ['email'],
                expectedValues: [
                                    {path: 'name', value: config[global.env].username},
                                    {path: 'gender', value: config[global.env].gender},
                                    {path: 'status', value: config[global.env].status}
                                ]
            }
        )
    })
}

export async function updateUser() {
    it('Update user account', async function () {
        const requestBody = await getUpdateUserRequestBody()
        await request(this, 'PATCH', `/users/${global.executionVariables['userId']}`, requestBody, true, 
            {
                statusCode : 200,
                expectedFields: ['email'],
                expectedValues: [
                                    {path: 'name', value: requestBody.name},
                                    {path: 'gender', value: requestBody.gender},
                                    {path: 'status', value: requestBody.status}
                                ]
            }
        )
    })
}