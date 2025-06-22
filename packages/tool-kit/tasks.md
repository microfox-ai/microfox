# @microfox/tool-kit Refactoring Plan

This document outlines the step-by-step plan to refactor the `@microfox/tool-kit` to support advanced human-in-the-loop interactions and multi-source toolsets, based on our discussion.

## Phase 1: Implement the Core Human Interaction Model

This is the foundational change, moving from a simple approval mechanism to a flexible, platform-agnostic interception model.

### Task 1.1: Create the Human Interaction Pseudo-Tool

- **Action:** Create a new file `src/human-interaction.ts`.
- **Details:** This file will define the contract for the `requestHumanInput` tool that the LLM will use to signal that it needs user feedback.
- **Exports:**
  - `HUMAN_INTERACTION_TOOL_NAME`: A constant for the tool name.
  - `humanInputSchema`: The Zod schema for the tool's parameters (`type`, `message`).
  - `humanInteractionToolDefinition`: The tool definition structure to be merged with other tools.

### Task 1.2: Establish the Server-Client API Contract

- **Action:** Define the data structures for communication in a new file, e.g., `src/types.ts`.
- **Details:** This ensures both the backend and frontend know what to expect when an interaction is paused and resumed.
- **Interfaces:**
  - `PendingHumanInputAction`: The object sent from the server to the client when an interaction is required (`status`, `interaction`, `messages`).
  - `ContinuePayload`: The object sent from the client to the `/continue` endpoint to resume the workflow (`messages`, `toolCallId`, `userInput`).

### Task 1.3: Develop the Orchestration Logic

- **Action:** Create a new primary client or function that orchestrates the `generateText`/`streamText` calls and performs the interception.
- **Details:** This logic will:
  1.  Take `messages` and a `toolset` as input.
  2.  Merge the `humanInteractionToolDefinition` with the user's tools.
  3.  Call the AI SDK's `generateText` or `streamText`.
  4.  Inspect the result for a `toolCall` to `requestHumanInput`.
  5.  If found, return a `PendingHumanInputAction`. Otherwise, return the standard AI response.
- **Note:** This will replace the logic currently in `src/humanlayer/process_layer.ts`.

---

## Phase 2: Multi-Server Tool Client

Once the core interaction model is stable, we'll add the ability to aggregate tools from multiple sources.

### Task 2.1: Implement `createMixedToolsClient`

- **Action:** Create a new file `src/mixed-client.ts`.
- **Details:** This factory will accept an array of server configurations (`id`, `baseUrl`, `docData`) and expose a unified `.tools()` method.
- **Features:**
  - The `.tools()` method should allow for filtering tools by name or via a custom function.
  - It should prefix tool names with the server `id` to prevent collisions (e.g., `google_search`, `github_getIssue`).

---

## Phase 3: Advanced Features & Future Work

These items will be addressed after the core refactoring is complete.

### Task 3.1: Pluggable Tool Selection Layer

- **Concept:** Design a `ToolSelector` interface that can be implemented with different strategies (e.g., keyword matching, AI-based selection) to dynamically choose which tools to provide to the LLM for a given query.

### Task 3.2: Formalize the Workflow Engine

- **Concept:** Develop the full-fledged workflow engine as per the PRD. This will be a separate package or framework that can consume tools and orchestrators built with the refactored `@microfox/tool-kit`.

---
