## GitBook Integrations API TypeScript SDK Summary

This document summarizes the GitBook Integrations API based on the provided information, focusing on the technical details required for generating a TypeScript SDK.  The original documentation primarily focuses on the project structure and doesn't expose specific API endpoints.  Therefore, this summary outlines a *potential* API structure based on common integration patterns and the user's request for GitHub API integration.

**User Query:** Add external SDK support for Github API

Given the lack of explicit API documentation and the user's query, we will assume the need for endpoints to interact with GitHub repositories and potentially GitBook spaces.

**Assumed API Base URL:** `/api/gitbook/integrations` (This is a placeholder and needs to be confirmed if real API documentation becomes available)


### 1. GitHub Repository Integration Endpoints

These endpoints facilitate connecting GitBook spaces with GitHub repositories.

**1.1. Connect GitHub Repository**

* **Description:** Connects a GitHub repository to a GitBook space.
* **Endpoint:** `/github/connect`
* **Method:** `POST`
* **Authentication:** OAuth 2.0 (GitHub)
* **Request Headers:**
    * `Authorization`: `Bearer <github_access_token>`
* **Request Parameters:**
    * `spaceId` (string, required): The ID of the GitBook space.
    * `repo` (string, required): The full name of the GitHub repository (e.g., "owner/repo").
* **Request Body:** (Optional) Could include additional configuration options like branch, webhook settings, etc.  Example:
    ```json
    {
      "branch": "main",
      "webhookEvents": ["push", "pull_request"]
    }
    ```
* **Response:**
    * **Status Codes:**
        * 200 OK: Successful connection. Returns the integration details.
        * 400 Bad Request: Invalid request parameters.
        * 401 Unauthorized: Invalid or missing GitHub access token.
        * 403 Forbidden: User does not have permission to connect the repository.
        * 404 Not Found: Space or repository not found.
        * 500 Internal Server Error: Server error during connection.
    * **Response Body (Success):**
        ```typescript
        interface IntegrationDetails {
          id: string;
          spaceId: string;
          repo: string;
          branch: string;
          webhookEvents: string[];
          createdAt: string;
          updatedAt: string;
        }
        ```

**1.2. Disconnect GitHub Repository**

* **Description:** Disconnects a GitHub repository from a GitBook space.
* **Endpoint:** `/github/disconnect`
* **Method:** `DELETE`
* **Authentication:**  OAuth 2.0 (GitHub)
* **Request Headers:**
    * `Authorization`: `Bearer <github_access_token>`
* **Request Parameters:**
    * `integrationId` (string, required): The ID of the integration.
* **Response:**
    * **Status Codes:**
        * 204 No Content: Successful disconnection.
        * 401 Unauthorized: Invalid or missing GitHub access token.
        * 403 Forbidden: User does not have permission to disconnect the repository.
        * 404 Not Found: Integration not found.
        * 500 Internal Server Error: Server error during disconnection.


**1.3. Get Connected Repositories**

* **Description:** Retrieves a list of GitHub repositories connected to a GitBook space.
* **Endpoint:** `/github/connections`
* **Method:** `GET`
* **Authentication:** OAuth 2.0 (GitHub)
* **Request Headers:**
    * `Authorization`: `Bearer <github_access_token>`
* **Request Parameters:**
    * `spaceId` (string, required): The ID of the GitBook space.
* **Response:**
    * **Status Codes:**
        * 200 OK: Returns a list of connected repositories.
        * 401 Unauthorized: Invalid or missing GitHub access token.
        * 404 Not Found: Space not found.
        * 500 Internal Server Error: Server error.
    * **Response Body (Success):**
        ```typescript
        interface IntegrationDetails { // Same as 1.1
          id: string;
          spaceId: string;
          repo: string;
          branch: string;
          webhookEvents: string[];
          createdAt: string;
          updatedAt: string;
        }

        type IntegrationList = IntegrationDetails[];
        ```


### 2. Authentication

* **GitHub OAuth 2.0:**  The assumed primary authentication method. The SDK needs to handle obtaining and refreshing GitHub access tokens.


### 3. Edge Cases

* **Rate Limiting:** The SDK should handle potential rate limiting from both the GitBook API and the GitHub API.
* **Error Handling:** Robust error handling is crucial, providing informative error messages to the user.
* **Webhooks:** If webhooks are supported, the SDK might need to provide utilities for managing webhook subscriptions.


### 4. TypeScript SDK Considerations

* **Interfaces:**  Clearly defined TypeScript interfaces for all request/response objects.
* **Methods:**  Asynchronous methods for each API endpoint.
* **Error Handling:**  Consistent error handling using custom error classes or exceptions.
* **OAuth 2.0 Handling:**  A dedicated module or class for managing GitHub authentication and token refresh.


This summary provides a starting point for building a TypeScript SDK.  It's essential to refer to the official GitBook Integrations API documentation (if and when it becomes available) for definitive information and adjust the SDK accordingly.


