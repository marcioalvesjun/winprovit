import fetch from 'node-fetch'

export class Letter {
  constructor() {
    this.usersUrl = 'https://jsonplaceholder.typicode.com/users'
    this.postsUrl = 'https://jsonplaceholder.typicode.com/posts'
  }

  async get() {
    try {
      const [usersResponse, postsResponse] = await Promise.all([
        fetch(this.usersUrl, { method: 'GET' }),
        fetch(this.postsUrl, { method: 'GET' })
      ])

      if (!usersResponse.ok) {
        throw new Error(usersResponse.statusText)
      }
      if (!postsResponse.ok) {
        throw new Error(postsResponse.statusText)
      }

      const users = await usersResponse.json()
      const posts = await postsResponse.json()
      const postsByUserId = posts.reduce((acc, post) => {
        const { userId, ...postWithoutUserId } = post
        if (!acc[userId]) {
          acc[userId] = []
        }

        acc[userId].push(postWithoutUserId)
        return acc
      }, {})

      return users.map(user => {
        return { ...user, posts: postsByUserId[user.id] }
      })
    } catch (error) {
      console.error(error)
    }
  }
}
