import { describe, it, expect, beforeAll } from '@jest/globals'
import request from 'supertest'
import { setupApp } from '../index.js'

let adminToken = null
let createdPostId = null
let app = null

beforeAll(async () => {
  app = await setupApp()
}, 10000)

describe('Admin API', () => {
  it('POST /api/admin/login with valid creds → 200, has token', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'Admin@1234' })
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.token.length).toBeGreaterThan(10)
    adminToken = res.body.token
  })

  it('POST /api/admin/login with wrong password → 401', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'wrongpassword' })
      .expect(401)

    expect(res.body.success).toBe(false)
  })

  it('GET /api/admin/me without token → 401', async () => {
    const res = await request(app)
      .get('/api/admin/me')
      .expect(401)

    expect(res.body.success).toBe(false)
  })

  it('GET /api/admin/me with valid token → 200', async () => {
    const res = await request(app)
      .get('/api/admin/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.user).toBeDefined()
  })

  it('GET /api/admin/stats with valid admin token → 200, has required fields', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.visitors).toBeDefined()
    expect(res.body.users).toBeDefined()
    expect(res.body.posts).toBeDefined()
    expect(typeof res.body.users.total).toBe('number')
  })

  it('GET /api/admin/users with valid admin token → 200, has users array', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.users)).toBe(true)
    for (const u of res.body.users) {
      expect(u.password_hash).toBeUndefined()
    }
  })

  it('POST /api/admin/posts → create post', async () => {
    const res = await request(app)
      .post('/api/admin/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Test Post', content: 'Test content here', status: 'draft' })
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(typeof res.body.id).toBe('number')
    createdPostId = res.body.id
  })

  it('GET /api/admin/posts → returns posts list', async () => {
    const res = await request(app)
      .get('/api/admin/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.posts)).toBe(true)
    const found = res.body.posts.find(p => p.id === createdPostId)
    expect(found).toBeDefined()
    expect(found.title).toBe('Test Post')
  })

  it('PUT /api/admin/posts/:id → update post', async () => {
    const res = await request(app)
      .put(`/api/admin/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'published' })
      .expect(200)

    expect(res.body.success).toBe(true)
  })

  it('DELETE /api/admin/posts/:id → delete post', async () => {
    const res = await request(app)
      .delete(`/api/admin/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(res.body.success).toBe(true)
  })

  it('DELETE /api/admin/posts/:id on deleted post → 404', async () => {
    const res = await request(app)
      .delete(`/api/admin/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404)

    expect(res.body.success).toBe(false)
  })

  it('GET /api/admin/logs → returns logs array', async () => {
    const res = await request(app)
      .get('/api/admin/logs')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.logs)).toBe(true)
  })
})
