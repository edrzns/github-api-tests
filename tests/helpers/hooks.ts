/**
 * Common test hooks
 * 
 * Provides reusable beforeEach/afterEach hooks for rate limiting
 * and resource cleanup.
 */

/**
 * Adds 1000ms delay before each test to respect GitHub API rate limits
 */
export async function applyRateLimitDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}