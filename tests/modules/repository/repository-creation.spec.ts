import { test, expect } from '@playwright/test';
import { generateRepoName } from '../../helpers/test-data';
import { getTestConfig } from '../../helpers/config';
import { applyRateLimitDelay } from '../../helpers/hooks';

/**
 * Test Module: Repository Management
 *
 * Tests repository creation functionality including:
 * - TC-REPO-001: Successful public repository creation
 * - TC-REPO-002: Duplicate name error handling
 * - TC-REPO-003: Missing required field validation
 *
 * Requirements: REQ-REPO-01, REQ-REPO-02
 */

const config = getTestConfig();
const createdRepos: string[] = [];

test.describe('Repository Creation', () => {
  // Rate limiting: 1000ms delay before each test
  test.beforeEach(async () => {
    await applyRateLimitDelay();
  });

  // Cleanup: Delete all repositories created during tests
  test.afterEach(async ({ request }) => {
    for (const repoName of createdRepos) {
      await request.delete(`/repos/${config.githubUsername}/${repoName}`).catch(() => {
        // Ignore errors if repo doesn't exist
      });
    }
    createdRepos.length = 0;
  });

  test(
    '[P1][TC-REPO-001] Create public repository successfully',
    {
      annotation: { type: 'requirement', description: 'REQ-REPO-01' },
    },
    async ({ request }) => {
      // Generate unique repository name
      const repoName = generateRepoName('playwright-api-test');

      // Send POST request to create repository
      const createResponse = await request.post('/user/repos', {
        data: {
          name: repoName,
          private: false,
          description: 'Test repository for TC-REPO-001',
        },
      });

      // Verify creation returns 201
      expect(createResponse.status()).toBe(201);

      const repo = await createResponse.json();

      // Track for cleanup
      createdRepos.push(repoName);

      // Extract and verify response fields
      expect(repo.name).toBe(repoName);
      expect(repo.private).toBe(false);
      expect(repo.owner.login).toBe(config.githubUsername);
      expect(typeof repo.id).toBe('number');
      expect(repo.id).toBeGreaterThan(0);

      // Verify repository exists via GET request
      const getResponse = await request.get(`/repos/${config.githubUsername}/${repoName}`);

      // GET returns 200 and private is false
      expect(getResponse.status()).toBe(200);

      const fetchedRepo = await getResponse.json();
      expect(fetchedRepo.private).toBe(false);
      expect(fetchedRepo.name).toBe(repoName);
    }
  );

  test(
    '[P2][TC-REPO-002] Duplicate repository name returns 422',
    {
      annotation: { type: 'requirement', description: 'REQ-REPO-02' },
    },
    async ({ request }) => {
      // Generate unique repository name
      const repoName = generateRepoName('test-duplicate');

      // Create repository
      const firstResponse = await request.post('/user/repos', {
        data: {
          name: repoName,
          private: true,
          description: 'First creation for duplicate test',
        },
      });

      // Verify first creation succeeds
      expect(firstResponse.status()).toBe(201);

      const firstRepo = await firstResponse.json();
      expect(firstRepo.name).toBe(repoName);

      // Track for cleanup
      createdRepos.push(repoName);

      // Verify attempt to create repository with same name fails
      const secondResponse = await request.post('/user/repos', {
        data: {
          name: repoName,
          private: true,
          description: 'Second creation attempt - should fail',
        },
      });

      // Verify second creation fails with 422
      expect(secondResponse.status()).toBe(422);

      const error = await secondResponse.json();

      // Verify error message matches expected format
      expect(error.message).toBe('Repository creation failed.');
      expect(error.errors).toBeDefined();
      expect(error.errors[0].message).toBe('name already exists on this account');
    }
  );

  test(
    '[P2][TC-REPO-003] Missing repository name returns 422',
    {
      annotation: { type: 'requirement', description: 'REQ-REPO-01' },
    },
    async ({ request }) => {
      // Send POST request without 'name' field
      const response = await request.post('/user/repos', {
        data: {
          description: 'Repository without a name',
          private: true,
        },
      });

      // Verify system returns 422
      expect(response.status()).toBe(422);

      const error = await response.json();

      // Verify error message references 'name' field
      expect(error.message).toContain('name');

      // Verify status is "422"
      expect(error.status).toBe('422');

      // Note: No repository is created, so no cleanup needed
    }
  );
});
