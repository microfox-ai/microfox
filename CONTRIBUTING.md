# Contributing to Microfox AI 🦊

First off, thank you for considering contributing to Microfox AI! We appreciate your time and effort. This guide will help you understand how you can contribute efffectually to the project.

## 🏗️ Basic Repo Introduction

Microfox AI is a monorepo managed with npm workspaces and Turborepo. Key directories include:

- **`packages/`**: Contains all the micor sdk packages. These are typically SDKs, API clients, or core functionalities.
  - Packages follow a pattern like `service-name` (e.g., `google-sheets`, `slack-web-tiny`)
  - Packages often have their own `__tests__` directory for unit tests.
  - Package complete information is at `package-info.json` and is very crucial for microfox to work.
- **`scripts/`**: Contains various ai agents, build, test, and utility scripts.
  - **`src/agents/`**: This directory houses specialized AI agents.
    - `metafox` - hosts meta info generators, validators & fixers
    - `docfox` - hosts documentation generators
    - `packagefox` - hosts coding agents that create packages
    - `testfox` - hosts coding agents that create tests
    - `slsfox` - hosts public remote tool calls genrators
  - Contributions here could involve improving existing agent logic, adding new capabilities to an agent, or developing entirely new agents.
  - **`src/ai`** : hosts ai models map & helper functions to log & track usage costs on PR.
  - **`src/embeddings/`**: for generating and managing embeddings of docs, which are crucial for semantic search for Ai.
  - **`src/serverless/`**: for sls deployments of remote tool calls
  - **`src/octokit`** : Github connection & PR/Issue comments
- **`.github/`**: Contains GitHub automations, including workflows for CI/CD and issue/PR.

Understanding this structure will help you navigate the codebase and identify where your contributions can fit.

## 🤝 How to Contribute

We welcome contributions in various forms. Here are the primary ways you can help:

If you are new, Get started over [here](https://github.com/microfox-ai/microfox/contribute)

### 1. Package Level Contributions

This involves working directly within the `packages/` directory.

- **Identify Bugs**: please [create an issue](https://github.com/THEMOONDEVS/microfox-ai/issues/new/choose) detailing the problem, steps to reproduce, and expected behavior.
- **Fix Bugs**: If you're able to fix a bug, fork the repo, apply your fix, and submit Pull Request. Ensure your PR description is neat.
- **Creating (Unit Tests)**: We aim for high test coverage. You can contribute by writing new `__tests__` or improving existing ones for packages.

### 2. Agent Level Contributions (High-Level Features & Refactors)

This involves significant changes to core functionalities. Agents are located in `scripts/agents` and follow a pattern of generators, helpers, and toolcalls. They primarily communicate through PR/Issue comments.

- **High-Level Refactors**: Create an issue first to discuss improvements to code structure, performance, or maintainability.
- **New Generative Features**: Add new utilities or enhance existing agent capabilities (e.g., `docfox` for docs, `testfox` for tests). Create a detailed proposal for substantial features.
- **New Specialized Agents**: Propose new agents for specific tasks (e.g., `securityfox` for security, `i18nfox` for translations). Start with an issue to discuss scope and feasibility.

### 3. Documentation & Team Level Contributions

- **Improving Documentation**: This `CONTRIBUTING.md` guide, the `README.md`, or inline code documentation (TSDoc/JSDoc) can always be improved.
- **Issue Triage**: Help us by reviewing open issues, confirming bugs, or suggesting labels.
- **Community Support**: Answer questions in discussions or on related forums.
- **Improving Workflows**: Suggest improvements to our CI/CD workflows in `.github/workflows/`.

## 🏷️ Contribute by Issue labels

Understanding how issues are created and labeled can help you find areas to contribute effectively. Contributors are welcome to [create issues](https://github.com/THEMOONDEVS/microfox-ai/issues/new/choose) for bugs they find or features they'd like to propose, many core-specific issues, especially those related to the AI agents' operations, will be take priority.

We use labels to categorize issues and make them easier to find and understand. Here are some common labels you might see:

- **`good first issue`**: These are often good starting points for contributors - check [here](https://github.com/microfox-ai/microfox/contribute)
- **`refactor`**: Issues with this label concern improving the existing agentic flows of the coding agents or workflows.
- **`coding agent`**: This label is used for issues related to the AI agents.
- **`documentation`**: This label is for issues related to any form of documentation.

### Fork

1.  **Fork the repository**: Click the "Fork" button on the [Microfox AI GitHub page](https://github.com/THEMOONDEVS/microfox-ai).
2.  **Create a new branch**: `git checkout -b dev/feat-name/month`
3.  **Make your changes**: Write your code and add tests!
4.  **Run tests & build checks**: `npm run test` & `npm run build`
5.  **Submit a Pull Request (PR)**: Please mention the issue in the PR description

### 💅 Code Style & Conventions

- **Formatting**: use Prettier for code formatting.
- **Linting**: Please run `npm run lint` to check if it follows the standards
- **Build check**: Plese run `npm run build` to check if all things are working.
- **Commit Messages**: Please follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). This helps us automate changelog generation and versioning.
  - Example: `feat(google-sheets): add support for batchGet an API`
  - Example: `fix(core): resolve issue with token caching`
  - Example: `docs(contributing): clarify example contribution process`

### 🔄 Lifecycle

1.  **Issue Creation**: Everythign starts with an issue. Provide as much detail as possible.
2.  **Discussion**: For significant changes, a maintainer will likely discuss the proposal with you in the issue comments, if it a minor, you can proceed with direct PR.
3.  **Pull Request Submission**: Once you're ready to submit your code, create a PR.
    - Link the PR to any relevant issues (e.g., "Closes #123").
    - Provide a clear description of the changes.
4.  **Review**: Maintainers will review your PR. They may ask for changes or provide feedback.
5.  **Merging**: Once the PR is approved and passes all checks, it will be merged.

## ❓ Questions

If you have any questions, feel free to ask by creating an issue or joining & communicating in our [discord](https://discord.gg/HAFDjqA2Jb).

Thank you for contributing to Microfox AI!
