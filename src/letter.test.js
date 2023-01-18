import nock from 'nock'
import { describe, beforeEach, afterEach, expect, it, vi } from 'vitest'
import { Letter } from './letter.js'
import { usersMock, postsMock } from './mock.js'

describe('Letter', () => {
  let letter

  beforeEach(() => {
    letter = new Letter()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should return an array of objects with the correct structure', async () => {
    nock('https://jsonplaceholder.typicode.com')
      .get('/users')
      .reply(200, usersMock)
      .get('/posts')
      .reply(200, postsMock)

    const result = await letter.get()
    expect(Array.isArray(result)).toBe(true)
    result.forEach(user => {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('address')
      expect(user).toHaveProperty('phone')
      expect(user).toHaveProperty('website')
      expect(user).toHaveProperty('company')
      expect(user).toHaveProperty('posts')
      expect(Array.isArray(user.posts)).toBe(true)
      user.posts.forEach(post => {
        expect(post).toHaveProperty('id')
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('body')
      })
    })
  })

  it('should handle errors when the API request fails', async () => {
    nock('https://jsonplaceholder.typicode.com')
      .get('/users')
      .replyWithError('error trying get to users')
      .get('/posts')
      .replyWithError('error trying get to posts')

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    await letter.get()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})
