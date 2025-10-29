# GitHub API Tests

![CI Status](https://github.com/edrzns/github-api-tests/workflows/API%20Tests/badge.svg)

Playwright test suite for GitHub REST API validation.

## Features
- ✅ Authentication validation
- ✅ Repository CRUD operations
- ✅ Error scenario testing
- ✅ Parallel-safe test execution
- ✅ Automatic cleanup
- ✅ CI/CD integration

## Setup
1. Install dependencies: `npm ci`
2. Configure environment variables (see `.env.example`)
3. Run tests: `npx playwright test`

## Environment Variables
```bash
GITHUB_TOKEN=ghp_xxxxx        # GitHub personal access token
GITHUB_USERNAME=your-username  # Your GitHub username
GITHUB_USER_ID=12345          # Your GitHub user ID
```

## CI/CD
Tests run automatically on:
- Every push to main/master
- Every pull request
- Manual workflow dispatch

View test reports in Actions → Artifacts