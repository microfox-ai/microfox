---
name: Trigger a new release
about: Create a new release for a package by creating an issue.
title: 'release <package-name> [major|minor|patch]'
labels: 'release'
---

## Release a new version of a package

This issue will trigger a new release for a specific package. Please edit the title of this issue to specify the package and the type of release.

### Instructions

1.  **Replace `<package-name>`** in the title with the full name of the package you want to release (e.g., `@microfox/ai-provider-perplexity`).
2.  **(Optional) Specify the release type.** You can specify `major`, `minor`, or `patch` after the package name. If you don't specify a type, it will default to a `patch` release.

### Examples

*   **Patch release:** `release @microfox/ai-provider-perplexity`
*   **Minor release:** `release @microfox/google-sheets minor`
*   **Major release:** `release @microfox/core major`

The workflow will automatically create a changeset, push it to `main`, and close this issue. This will then trigger the release process. 