import { test, expect } from '@playwright/test';

test('POST /user/repos creates repository', async ({ request }) => {
  const repoName = `test-repo-${Date.now()}`; // Unique name

  const response = await request.post('/user/repos', {
    data: {
      name: repoName,
      description: 'Test repository',
      private: true,
    },
  });

  expect(response.status()).toBe(201); // Created

  const repo = await response.json();

  // What should you assert here?
  // Think: what proves the repo was created correctly?
  expect(repo.name).toBe(repoName);
  expect(repo.owner.login).toBe(process.env.GITHUB_USERNAME);

  expect(repo.description).toBe('Test repository');
  expect(repo.private).toBe(true);

  expect(repo.full_name).toBe(`${process.env.GITHUB_USERNAME}/${repoName}`);
  expect(typeof repo.id).toBe('number');
  expect(repo.id).toBeGreaterThan(0);

  expect(repo.created_at).toBeDefined();
  expect(typeof repo.created_at).toBe('string');
  expect(new Date(repo.created_at).getTime()).toBeGreaterThan(Date.now() - 5000);
  expect(repo.url).toContain(repoName);
});
