import { test, expect } from '@playwright/test';

test.describe('POST /user/repos', () => {
  test('POST /user/repos creates repository', async ({ request }) => {
    const repoName = `test-repo-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    let repoCreated = false;

    try {
      const response = await request.post('/user/repos', {
        data: {
          name: repoName,
          description: 'Test repository',
          private: true,
        },
      });

      repoCreated = response.status() === 201;
      expect(response.status()).toBe(201);

      const repo = await response.json();

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
    } finally {
      if (repoCreated) {
        await request.delete(`/repos/${process.env.GITHUB_USERNAME}/${repoName}`);
      }
    }
  });

  test('POST /user/repos with duplicate name returns 422', async ({ request }) => {
    const repoName = `test-repo-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    let repoCreated = false;

    try {
      // First creation - should succeed
      const firstResponse = await request.post('/user/repos', {
        data: { name: repoName, private: true },
      });
      repoCreated = firstResponse.status() === 201;
      expect(firstResponse.status()).toBe(201);

      // Second creation - should fail
      const secondResponse = await request.post('/user/repos', {
        data: { name: repoName, private: true },
      });

      expect(secondResponse.status()).toBe(422);

      const error = await secondResponse.json();

      expect(error.message).toBe('Repository creation failed.');
      expect(error.errors[0].message).toBe('name already exists on this account');
      expect(error.status).toBe('422');
    } finally {
      if (repoCreated) {
        await request.delete(`/repos/${process.env.GITHUB_USERNAME}/${repoName}`);
      }
    }
  });

  test('POST /user/repos without name returns 422', async ({ request }) => {
    const response = await request.post('/user/repos', {
      data: {
        description: 'Missing name',
        private: true,
      },
    });

    expect(response.status()).toBe(422);

    const error = await response.json();
    expect(error.message).toContain('name');
    expect(error.status).toBe('422');
  });
});
