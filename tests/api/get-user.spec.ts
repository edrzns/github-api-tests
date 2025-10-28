import { test, expect } from '@playwright/test';

test('GET /user with auth', async ({ request }) => {

  const response = await request.get('/user');

  expect(response.status()).toBe(200);

  const user = await response.json();

  expect(user.login).toBe(process.env.GITHUB_USERNAME);
  expect(user.id).toBe(Number(process.env.GITHUB_USER_ID));

  if (user.email) {
    expect(user.email).toContain('@');
  }

  expect(typeof user.created_at).toBe('string');
  expect(typeof user.public_repos).toBe('number');
});
