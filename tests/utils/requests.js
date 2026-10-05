import addContext from 'mochawesome/addContext.js'
import supertest from 'supertest'
import { config } from '../../config.js'
import { expect, assert } from 'chai'
import getNestedValue from 'get-nested-value'

export async function request(context, method, path, requestBody = undefined, auth = true, assertions = {statusCode : 200},  host = undefined, customHeaders = undefined) {
    const client = host ? supertest(host) : supertest(config[global.env].host)

    const headers = customHeaders ? customHeaders : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(auth && {'Authorization': `Bearer ${config[global.env].token}`})
    }

    let response = null
    let responseBody

    switch (method) {
        case 'GET':
            response = await client.get(path).set(headers)
            responseBody = response.body
            await runAssertions(responseBody, assertions, context, method, path, headers, response)
            break
        case 'POST':
            response = await client.post(path).send(requestBody).set(headers)
            responseBody = response.body
            await runAssertions(responseBody, assertions, context, method, path, headers, response, requestBody)
            break
        case 'PATCH':
            response = await client.patch(path).send(requestBody).set(headers)
            responseBody = response.body
            await runAssertions(responseBody, assertions, context, method, path, headers, response, requestBody)
            break
        case 'DELETE':
            response = await client.delete(path).send(requestBody).set(headers)
            responseBody = response.body
            await runAssertions(responseBody, assertions, context, method, path, headers, response, requestBody)
            break
        case 'PUT':
            response = await client.put(path).send(requestBody).set(headers)
            responseBody = response.body
            await runAssertions(responseBody, assertions, context, method, path, headers, response, requestBody)
            break
        default:
            console.log('not valid request method provided')
    }

    return response
}

async function runAssertions(responseBody, assertions, context, method, path, headers, response, requestBody) {
    await validateStatusCode(response.statusCode, assertions.statusCode, context, method, path, headers, response, requestBody)

    if (assertions.expectedFields) {
        await validateFieldsExists(responseBody, assertions.expectedFields, context, method, path, headers, response, requestBody)
    }

    if (assertions.expectedValues) {
        await validateExpectedValues(responseBody, assertions.expectedValues, context, method, path, headers, response, requestBody)
    }

    if (assertions.executionVariables) {
        await setExecutionVariables(responseBody, assertions.executionVariables)
    }
}

async function validateStatusCode(actual, expected, context, method, path, headers, response, requestBody) {
    try {
        expect(actual).to.be.equal(expected)
    } catch(error) {
        addRequestInfoToReport(context, method, path, headers, response, requestBody)
        assert.fail(error.actual, error.expected, `Actual is ${error.actual}, but expected was ${error.expected}`)
    }
}

async function validateFieldsExists(body, fields, context, method, path, headers, response, requestBody) {
    fields.forEach(field => {
        try {
            expect(getNestedValue(field, body), `${field} present in body`).not.to.be.undefined
        } catch (error) {
            addRequestInfoToReport(context, method, path, headers, response, requestBody)
            assert.fail(error.actual, error.expected, `${field} field is not present in body`)
        }
    })
}

async function validateExpectedValues(body, fields, context, method, path, headers, response, requestBody) {
    fields.forEach(field => {
        try {
            expect(getNestedValue(field.path, body), `${field.path} not equal to ${field.value}`).to.be.equal(field.value)
        } catch (error) {
            addRequestInfoToReport(context, method, path, headers, response, requestBody)
            const actual = getNestedValue(field.path, body)
            assert.fail(actual, field.value, `${field.path} expected value is ${field.value}, but actual was ${actual}`)
        }
    })
}

async function setExecutionVariables(body, variables) {
    variables.forEach(variable => {
        global.executionVariables[variable.name] = getNestedValue(variable.path, body)
    })
}

function addRequestInfoToReport(context, method, path, headers, response, body) {
    addContext(context, `${method} ${path}`)
    addContext(context, {
        title: 'REQUEST HEADERS',
        value: headers
    })
    if (body) {
        addContext(context, {
            title: 'REQUEST BODY',
            value: body
        })
    }
    addContext(context, {
        title: 'RESPONSE HEADERS',
        value: response.headers
    })
    addContext(context, {
        title: 'RESPONSE BODY',
        value: response.body
    })
}
