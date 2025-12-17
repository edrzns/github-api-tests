# Test Cases: GitHub API Automation

## 1. Document Overview
This document contains the functional and non-functional test cases for the GitHub API testing project. These cases are designed to be atomic, independent, and automated using Playwright.

**Traceability Matrix Reference:**
* **REQ-REPO**: Repository Management Requirements
* **REQ-ISSUE**: Issue Tracking Requirements
* **REQ-AUTH**: Authentication Requirements

---

## 2. Module: Repository Management (REQ-REPO)

### TC-REPO-001: Verify Successful Creation of a Public Repository
* **Traceability:** REQ-REPO-01
* **Priority:** P1 (Critical)
* **Objective:** Validate that a user can create a repository with valid parameters.
* **Preconditions:**
    1. Valid `GITHUB_TOKEN` provided in environment.
    2. Repository name `playwright-api-test-${UUID}` does not exist.
* **Test Steps:**
    1. Send `POST` request to `/user/repos`.
    2. Payload: `{ "name": "playwright-api-test-${UUID}", "private": false }`.
    3. Extract `id` and `html_url` from response.
    4. Send `GET` request to `/repos/{owner}/{name}` using the extracted name.
* **Expected Results:**
    1. Step 1 returns `201 Created`.
    2. Response body matches the schema for "Repository".
    3. Step 4 returns `200 OK` and `private` field is `false`.
* **Post-conditions:**
    1. Delete the created repository via `DELETE /repos/{owner}/{name}`.

### TC-REPO-002: Verify Error on Duplicate Repository Name
* **Traceability:** REQ-REPO-02
* **Priority:** P2 (Major)
* **Objective:** Ensure the API prevents name collisions.
* **Preconditions:**
    1. Valid `GITHUB_TOKEN` provided in environment.
* **Test Steps:**
    1. Generate unique repository name `test-duplicate-${UUID}`.
    2. Send `POST` request to `/user/repos` with generated name.
    3. Verify response status is `201 Created`.
    4. Send second `POST` request to `/user/repos` with same name.
    5. Verify response status is `422 Unprocessable Entity`.
* **Expected Results:**
    1. First request (Step 2) succeeds with `201 Created`.
    2. Second request (Step 4) fails with `422 Unprocessable Entity`.
    3. Error response contains: `"message": "Repository creation failed."`.
    4. Error array includes: `"message": "name already exists on this account"`.
* **Post-conditions:**
    1. Delete the created repository via `DELETE /repos/{owner}/{name}`.

### TC-REPO-003: Verify Error When Repository Name is Missing
* **Traceability:** REQ-REPO-01
* **Priority:** P2 (Major)
* **Objective:** Validate that the API enforces required field validation.
* **Preconditions:**
    1. Valid `GITHUB_TOKEN` provided in environment.
* **Test Steps:**
    1. Send `POST` request to `/user/repos` with payload containing only `description` and `private` fields.
    2. Verify `name` field is not included in the request body.
* **Expected Results:**
    1. System returns `422 Unprocessable Entity`.
    2. Error response contains message referencing the `name` field requirement.
    3. Error response contains `"status": "422"`.
* **Post-conditions:**
    1. No repository is created.

---

## 3. Module: Issue Management (REQ-ISSUE)

### TC-ISSUE-001: Verify Full Issue Lifecycle (Open to Closed)
* **Traceability:** REQ-ISSUE-01, REQ-ISSUE-02
* **Priority:** P1 (Critical)
* **Objective:** Validate the state transition of an issue from creation to resolution.
* **Preconditions:**
    1. A test repository exists.
* **Test Steps:**
    1. Send `POST` to `/repos/{owner}/{repo}/issues` with title "Automated Bug".
    2. Capture `issue_number`.
    3. Send `PATCH` to `/repos/{owner}/{repo}/issues/{issue_number}` with `{ "state": "closed" }`.
    4. Send `GET` to the issue endpoint to verify final state.
* **Expected Results:**
    1. Step 1 returns `201 Created`.
    2. Step 3 returns `200 OK`.
    3. Step 4 response shows `"state": "closed"` and `"state_reason": "completed"`.
* **Post-conditions:** None (Issues cannot be deleted via API, only locked/closed).



---

## 4. Module: Security & Authentication

### TC-AUTH-001: Verify Unauthorized Access Rejection
* **Traceability:** REQ-AUTH-01
* **Priority:** P1 (Critical)
* **Objective:** Ensure the API enforces authentication.
* **Preconditions:**
    1. No `Authorization` header provided.
* **Test Steps:**
    1. Send `GET` request to `/user/repos`.
* **Expected Results:**
    1. System returns `401 Unauthorized`.
    2. Response body contains `"message": "Requires authentication"`.
* **Post-conditions:** None.
