# SRE Interview Assignment Submission

## ⚙️ CI/CD Pipeline Explained

The repository is configured with two distinct GitHub Actions workflows to automate testing and builds.

### 1. `ci.yml` - Pull Request Checks

This workflow is designed to maintain code quality before anything is merged into the `main` branch.

-   **Trigger:** Runs automatically on every pull/push request opened against any branch except `main`.
-   **Actions:**
    1.  Installs all dependencies.
    2.  Runs the complete test suite (`npx jest --coverage --coverageReporters json-summary`).
    3.  If the tests pass, the PR can be merged.
    4.  If the tests fail, the PR is blocked from merging.
    5.  A comment is automatically posted on the pull request with a summary of the test coverage report, providing immediate feedback.

### 2. `build.yml` - Main Branch Build & Deploy

This workflow handles the build process after code has been successfully merged into the `main` branch.

-   **Trigger:** Runs automatically on every push to the `main` branch.
-   **Actions:**
    1.  Installs dependencies and runs the test suite again as a final verification step.
    2.  Builds a Docker image of the application with caching.
    3.  Pushes the Docker image to a temporary, anonymous registry (`ttl.sh`) with a 1-minute lifespan.
    4.  Sends a notification to a Slack channel (via a webhook) with the status of the build and the URL of the temporary Docker image.

### Instructions For Running And Testing Solutions

    - Push to any branch except `main`, The CI workflow will run test cases and fail if not all passed.
    - Open any PR to any branch, The CI workflow will run test cases and comment result on the PR.
    - Push or Merge to `main`, The Build workflow will run test cases and build docker image with caching and notify slack channel (need to create a slack App and webhook url `https://api.slack.com/messaging/webhooks`).
