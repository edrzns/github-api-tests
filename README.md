# GitHub API Tests

Small Playwright test suite to validate GitHub REST API.

## Setup
1. Install dependencies: `npm install`
2. Export GitHub token:
   - macOS/Linux:
   ```bash
    export GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXX`
   ```
   - Windows:
   ```powershell
    $env:GITHUB_TOKEN="ghp_XXXXXXXXXXXXXXXXXXXX"`
   ```
   
   Or put it in `.env` file as a variable in the project root if want to use `dotenv`
   ```sh
   # .env file
   GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXX
   ```
3. Run tests: `npx playwright test`

