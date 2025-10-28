import { test, expect } from '@playwright/test';

test.describe('GET /user', () => {
  test('GET /user with auth', async ({ request }) => {
    const response = await request.get('/user');

    expect(response.status()).toBe(200);

    const user = await response.json();

    expect(user.login).toBe(process.env.GITHUB_USERNAME);
    const expectedUserId = parseInt(process.env.GITHUB_USER_ID || '0', 10);
    if (expectedUserId === 0) {
      throw new Error('GITHUB_USER_ID environment variable not set');
    }
    expect(user.id).toBe(expectedUserId);

    if (user.email) {
      expect(user.email).toContain('@');
    }

    expect(typeof user.created_at).toBe('string');
    expect(typeof user.public_repos).toBe('number');
  });

  test('GET /user without auth returns 401', async ({ request }) => {
    // Override the auth header for this test
    const response = await request.get('/user', {
      headers: {
        Authorization: 'Bearer invalid-token-12345',
      },
    });

    expect(response.status()).toBe(401);

    const error = await response.json();

    expect(error.message).toBe('Bad credentials');
  });
});
