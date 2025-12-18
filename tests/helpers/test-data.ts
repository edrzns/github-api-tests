/**
 * Test Data Generation Utilities
 * 
 * Provides functions to generate unique, atomic test data that ensures
 * test independence and prevents collisions.
 */

/**
 * Generates a unique repository name using timestamp and random string
 * 
 * Pattern: test-repo-{timestamp}-{random}
 * Example: test-repo-1703001234567-a3f9k2
 * 
 * @param prefix - Optional prefix for the repository name (default: 'test-repo')
 * @returns Unique repository name string
 */
export function generateRepoName(prefix: string = 'test-repo'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generates a unique issue title for testing
 * 
 * @param prefix - Optional prefix for the issue title (default: 'Test Issue')
 * @returns Unique issue title string
 */
export function generateIssueTitle(prefix: string = 'Test Issue'): string {
  const timestamp = Date.now();
  return `${prefix} - ${timestamp}`;
}