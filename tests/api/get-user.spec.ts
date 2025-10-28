import { test, expect } from '@playwright/test';

test('GET /user with auth', async ({ request }) => {
  const githubUser = 'edrzns';
  const githubId = 23223089;

  const response = await request.get('/user', {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  expect(response.status()).toBe(200);

  const user = await response.json();

  expect(user.login).toBe(githubUser);
  expect(user.id).toBe(githubId);

  if (user.email) {
    expect(user.email).toContain('@');
  }

  expect(typeof user.created_at).toBe('string');
  expect(typeof user.public_repos).toBe('number');
});
