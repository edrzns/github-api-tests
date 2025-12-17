# Test Plan: GitHub API Automation Project

| Project | GitHub API Tests |
| :--- | :--- |
| **Version** | 1.0.0 |
| **Author** | Edijs Rozens |
| **Status** | Draft |
| **Type** | Automated Integration Testing |

## 1. Introduction
### 1.1 Objective
The objective of this test plan is to outline the strategy, scope, resources, and schedule for the automated testing of the GitHub REST API. The goal is to ensure the **Repository** and **Issue** management modules meet functional requirements before integration into larger CI/CD pipelines.

### 1.2 Analysis of Product
The product under test is the GitHub REST API. It is a stateless, HTTP-based interface used by millions of developers. 
* **Criticality:** High. (Failure stops development workflows).
* **Volatility:** Low. (API schema changes are rare/versioned).

## 2. Scope

### 2.1 Features In-Scope (Functional Testing)
* **Repository Management:** `Create`, `Get`, `Delete` (Private/Public contexts).
* **Issue Tracking:** `Create`, `Update Body`, `Lock`, `Close`.
* **Error Handling:** Validation of `422 Unprocessable Entity` (Duplicates) and `401 Unauthorized`.

### 2.2 Features Out-of-Scope
* **UI/Frontend:** No Browser interaction.
* **Performance:** No load testing (to respect GitHub API Rate Limits).
* **Billing/Payments:** Explicitly excluded.

## 3. Requirements Mapping
To ensure traceability, the following high-level requirements are defined for this project:
* **REQ-REPO-01:** Authenticated users shall be able to create repositories.
* **REQ-REPO-02:** The system shall prevent duplicate repository names for the same user.
* **REQ-ISSUE-01:** Users shall be able to create issues within a repository.
* **REQ-ISSUE-02:** The system shall support state transitions (e.g., `Open` to `Closed`).
* **REQ-AUTH-01:** The system shall restrict access to authorized users only.

## 4. Test Strategy
Will utilize **Automated API Testing** using Playwright.
* **Design Technique:** Black Box Testing (State Transition & Equivalence Partitioning).
* **Execution Model:** Sequential execution (to prevent state collision).
* **Data Strategy:** Dynamic generation of test data (UUIDs) to ensure atomicity.

## 5. Test Environment
| Component | Specification |
| :--- | :--- |
| **OS** | Ubuntu Latest (CI), Windows/Linux (Local) |
| **Runtime** | Node.js v18+ |
| **Framework** | Playwright Test |
| **Target** | `https://api.github.com` |
| **Auth** | Personal Access Token (PAT) via `.env` |

## 6. Entry and Exit Criteria

### 6.1 Entry Criteria (Definition of Ready)
Testing cannot commence until:
1.  [x] Test Environment is configured (Node.js & Playwright installed).
2.  [x] Valid GitHub Personal Access Token (PAT) with `repo` scope is generated.
3.  [x] "Smoke Test" (Get User Profile) returns `200 OK`.

### 6.2 Exit Criteria (Definition of Done)
Testing is considered complete when:
1.  [ ] **100%** of Critical (P1) test cases pass.
2.  [ ] **90%** of Major (P2) test cases pass.
3.  [ ] No "Blocking" defects remain open.
4.  [ ] Test Execution Report is generated and archived.

## 7. Risks & Mitigation
| Risk | Probability | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| **API Rate Limiting** | High | Blocked Tests | Implement 1000ms delay between tests; use mock data for non-critical reads. |
| **Residual Data** | Medium | Account Bloat | `afterAll` hook implemented to delete all resources created during execution. |

## 8. Deliverables
1.  Test Plan Document (`/docs/TEST_PLAN.md`).
2.  Test Cases Document (`/docs/TEST_CASES.md`).
3.  Automated Test Scripts (`/tests/*.spec.ts`).
4.  Test Execution Report (HTML Format).