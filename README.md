# Float SRE Team - Interview Assignment

Welcome to the Float SRE Team - Interview Assignment! 

## Problem Statement

The Float development team has built this application and now they want to:

- Run the application’s tests in GitHub Actions.
- Build and publish an image whenever a branch is merged to `main`.

They need support from the SRE team to set this up.

### Task Description

Build a CI pipeline for the application that developers can reuse for other applications.

---

### Basic Requirements

Your solution **must** meet all of the following:

1. **Run tests inside the image being built for use**.
2. **Run tests against every branch** (every push to any branch, not only `main`).
3. **If tests pass, build a new release image** and push it to a container registry (`ttl.sh` recommended).
4. **Provide a way for developers to see test results promptly** (e.g., in PRs or elsewhere).

### Image Registry

We recommend using [`ttl.sh`](https://ttl.sh/) as a free container registry with a low TTL (e.g., 1 minute).

---

### Evaluation Criteria

Your submission will be scored against the following:

- **Usability** – Developers receive actionable feedback from the pipeline (e.g., PR comments, Slack notifications, clear logs).
- **Security Best Practices** – Secrets handled appropriately; no sensitive values committed to the repo.
- **Scalability & Robustness** – Efficient build times, caching, parallelism, and resilience against common errors.
- **Maintainability** – Clean, modular, and reusable code with clear documentation.
- **Git Commit Best Practices** – Logical, granular commits with meaningful messages.

---

### Out of Scope

- Application deployment.

---

### Submission

Please include:

- Instructions for running and testing your solution.
- Any notes on additional features you would have added if you had more time.
- **Highly encouraged**: Record a short loom video (5 mins max) covering:
    - Your overall approach to solving the problem.
    - Key design decisions and trade-offs you made.
    - Anything you would do differently or add if you had more time.
- Please aim to complete the assignment within 2 hours. We aren’t looking for perfection, we just want to see what you can do within that timeframe.
- Kindly send your submission to Julia via email within 3–4 days. If you need more time, just let us know; we’re happy to accommodate!

Once we receive your completed assignment, we’ll send a small token of appreciation to thank you for the time and effort you’ve invested. We really appreciate it!

### AI Use Expectations

We expect that you may use AI tools (such as GitHub Copilot, ChatGPT, etc.) as part of your workflow.

Please follow these guidelines:

1. **Use AI as you normally would** in your day-to-day work.
2. In your submission, share **how AI contributed** to your final solution — for example, whether it helped with code generation, debugging, or research.
3. The focus is on a **demonstration covering all requirements**, not a production-ready or fully polished solution.
4. Thoughtful, appropriate use of AI is acceptable and encouraged — but you must **fully understand and take ownership** of the final solution.
