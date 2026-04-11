import { describe, it, expect, beforeEach, vi } from 'vitest'

// We need to reset module state between tests since useAdminAuth uses module-level refs
// We'll do this by resetting localStorage and re-importing the module

describe('useAdminAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('isAuthenticated is false when no token in localStorage', async () => {
    localStorage.clear()
    const { isAuthenticated } = await import('../admin/useAdminAuth')
    // Force re-read by clearing and importing fresh
    expect(isAuthenticated.value).toBe(false)
  })

  it('login() sets token + user in localStorage, isAuthenticated becomes true', async () => {
    const { login, isAuthenticated } = await import('../admin/useAdminAuth')
    const fakeUser = { id: 1, username: 'admin', role: 'admin' }
    login('test-token-123', fakeUser)

    expect(localStorage.getItem('admin_token')).toBe('test-token-123')
    expect(localStorage.getItem('admin_user')).toBe(JSON.stringify(fakeUser))
    expect(isAuthenticated.value).toBe(true)
  })

  it('logout() clears token + user, isAuthenticated becomes false', async () => {
    const { login, logout, isAuthenticated } = await import('../admin/useAdminAuth')
    login('test-token-abc', { id: 1, username: 'admin', role: 'admin' })
    expect(isAuthenticated.value).toBe(true)

    logout()
    expect(localStorage.getItem('admin_token')).toBeNull()
    expect(localStorage.getItem('admin_user')).toBeNull()
    expect(isAuthenticated.value).toBe(false)
  })

  it('authFetch adds Authorization header when token is set', async () => {
    const { login, authFetch } = await import('../admin/useAdminAuth')
    login('my-test-token', { id: 1, username: 'admin', role: 'admin' })

    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ success: true })
    })
    vi.stubGlobal('fetch', mockFetch)

    await authFetch('/admin/me')

    expect(mockFetch).toHaveBeenCalledOnce()
    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer my-test-token')

    vi.unstubAllGlobals()
  })

  it('verifySession returns false when no token', async () => {
    localStorage.clear()
    // Import fresh module with no token
    const mod = await import('../admin/useAdminAuth')
    mod.logout() // ensure clean state
    const result = await mod.verifySession()
    expect(result).toBe(false)
  })

  it('verifySession calls /admin/me and updates user on success', async () => {
    const { login, verifySession } = await import('../admin/useAdminAuth')
    login('valid-token', { id: 1, username: 'admin', role: 'admin' })

    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ success: true, user: { id: 1, username: 'admin', role: 'admin' } })
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await verifySession()
    expect(result).toBe(true)

    vi.unstubAllGlobals()
  })
})
