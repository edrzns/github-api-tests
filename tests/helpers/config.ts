/**
 * Test Configuration
 * 
 * Centralizes access to environment variables and test configuration.
 * Validates required variables are present before tests run.
 */

interface TestConfig {
  githubToken: string;
  githubUsername: string;
  githubUserId: number;
}

/**
 * Validates and returns test configuration from environment variables
 * 
 * @throws Error if required environment variables are missing
 * @returns Validated test configuration object
 */
export function getTestConfig(): TestConfig {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  const userId = process.env.GITHUB_USER_ID;

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  if (!username) {
    throw new Error('GITHUB_USERNAME environment variable is required');
  }

  if (!userId) {
    throw new Error('GITHUB_USER_ID environment variable is required');
  }

  const parsedUserId = parseInt(userId, 10);
  if (isNaN(parsedUserId) || parsedUserId <= 0) {
    throw new Error('GITHUB_USER_ID must be a valid positive integer');
  }

  return {
    githubToken: token,
    githubUsername: username,
    githubUserId: parsedUserId,
  };
}