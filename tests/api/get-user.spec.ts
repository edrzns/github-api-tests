import { test, expect } from '@playwright/test';

test('GET /user with auth', async ({ request }) => {
  const githubUser = 'edrzns';
  const response = await request.get('/user', {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  expect(response.status()).toBe(200);

  const user = await response.json();

  // Verify response structure
  expect(user).toHaveProperty('login');
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('email');

  // Verify it's YOUR user
  expect(user.login).toBe(githubUser); // your GitHub username

  // Verify data types
  expect(typeof user.id).toBe('number');
  expect(typeof user.login).toBe('string');
});
