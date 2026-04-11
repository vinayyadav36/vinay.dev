import { describe, it, expect, beforeAll } from '@jest/globals'
import request from 'supertest'
import { setupApp } from '../index.js'

let adminToken = null
let createdEntryId = null
let app = null

beforeAll(async () => {
  app = await setupApp()
  const res = await request(app)
    .post('/api/admin/login')
    .send({ username: 'admin', password: 'Admin@1234' })
  adminToken = res.body.token
}, 10000)

describe('Guestbook API', () => {
  it('GET /api/guestbook → 200, entries array', async () => {
    const res = await request(app)
      .get('/api/guestbook')
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.entries)).toBe(true)
  })

  it('POST /api/guestbook valid → 201', async () => {
    const res = await request(app)
      .post('/api/guestbook')
      .send({ name: 'TestUser', message: 'Hello from test suite!' })
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.entry).toBeDefined()
    expect(res.body.entry.name).toBe('TestUser')
    expect(res.body.entry.ip).toBeUndefined()
    createdEntryId = res.body.entry.id
  })

  it('POST /api/guestbook invalid (short name) → 400', async () => {
    const res = await request(app)
      .post('/api/guestbook')
      .send({ name: 'X', message: 'Hello from test suite!' })
      .expect(400)

    expect(res.body.success).toBe(false)
  })

  it('POST /api/guestbook invalid (short message) → 400', async () => {
    const res = await request(app)
      .post('/api/guestbook')
      .send({ name: 'ValidName', message: 'Hi' })
      .expect(400)

    expect(res.body.success).toBe(false)
  })

  it('DELETE /api/guestbook/:id without auth → 401', async () => {
    const res = await request(app)
      .delete('/api/guestbook/1')
      .expect(401)

    expect(res.body.success).toBe(false)
  })

  it('DELETE /api/guestbook/:id with admin auth → 200', async () => {
    if (!createdEntryId) return
    const res = await request(app)
      .delete(`/api/guestbook/${createdEntryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(res.body.success).toBe(true)
  })
})
