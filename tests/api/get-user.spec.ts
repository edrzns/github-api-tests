import { test, expect } from '@playwright/test';

test('GET /user with auth', async ({ request }) => {
  const response = await request.get('/user');

  expect(response.status()).toBe(200);
  const body = await response.json();
  console.log(body);
});
