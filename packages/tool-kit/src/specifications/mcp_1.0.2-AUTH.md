# x-auth-packages in MCP Specifications

## Overview

The `x-auth-packages` field in MCP (Model Context Protocol) specifications defines the environment variables needed for the MCP to run properly. This field helps the MCP client understand which packages are required and what authentication credentials need to be provided (sometimes provided by the basis of the packageCOnstructor).

## Structure

The `x-auth-packages` field is an array of objects, where each object can contain:

```json
{
  "packageName": "string", // Required: The npm package name
  "packageConstructor": "string" // Optional: The constructor class name
}
```

## Usage Examples

### Basic Package Definition

```json
{
  "components": {
    "x-auth-packages": [
      {
        "packageName": "@microfox/slack-web-tiny"
      }
    ]
  }
}
```

This translates to "Send me all env variabels associated with package - @microfox/slack-web-tiny"

### Package with Constructor

```json
{
  "components": {
    "x-auth-packages": [
      {
        "packageName": "@microfox/my-tool-kit",
        "packageConstructor": "MyClient"
      }
    ]
  }
}
```

This translates to "Send me all env variabels associated with package - @microfox/slack-web-tiny of MyClient constructor."

### Multiple Packages

```json
{
  "components": {
    "x-auth-packages": [
      {
        "packageName": "@microfox/slack-web-tiny"
      },
      {
        "packageName": "@microfox/twitter",
        "packageConstructor": "TwitterClient"
      },
      {
        "packageName": "@microfox/google-sheets"
      }
    ]
  }
}
```

## How It Works

1. **Environment Variable Resolution**: The MCP client uses the `packageName` to determine which environment variables are required for authentication.

2. **Authentication Flow**: When a tool is executed, the client:
   - Checks the `x-auth-packages` array
   - Resolves the required environment variables for each package
   - Passes these credentials to the underlying service

## x-auth-custom-secrets

The `x-auth-custom-secrets` field allows you to specify additional custom environment variables that are not tied to any specific package but are required for the MCP to function properly.

### Structure

The `x-auth-custom-secrets` field is an array of strings, where each string represents an environment variable name:

```json
{
  "components": {
    "x-auth-custom-secrets": [
      "CUSTOM_API_KEY",
      "WEBHOOK_SECRET",
      "DATABASE_URL"
    ]
  }
}
```

### Usage Examples

#### Basic Custom Secrets

```json
{
  "components": {
    "x-auth-custom-secrets": ["CUSTOM_API_KEY"]
  }
}
```

This translates to "Send me the environment variable named CUSTOM_API_KEY"

#### Multiple Custom Secrets

```json
{
  "components": {
    "x-auth-custom-secrets": [
      "WEBHOOK_SECRET",
      "DATABASE_URL",
      "REDIS_PASSWORD"
    ]
  }
}
```

### Integration with x-auth-packages

You can use both `x-auth-packages` and `x-auth-custom-secrets` together:

```json
{
  "components": {
    "x-auth-packages": [
      {
        "packageName": "@microfox/slack-web-tiny"
      },
      {
        "packageName": "@microfox/twitter",
        "packageConstructor": "TwitterClient"
      }
    ],
    "x-auth-custom-secrets": ["WEBHOOK_SECRET", "CUSTOM_API_KEY"]
  }
}
```

This translates to "Send me all env variables associated with packages @microfox/slack-web-tiny and @microfox/twitter (TwitterClient constructor), plus the custom environment variables WEBHOOK_SECRET and CUSTOM_API_KEY"

## Implementation Status

**Note**: The `x-auth-custom-secrets` feature is currently **to-be-implemented**. While the specification supports this field, the actual implementation in the MCP client is still pending.

### Updated How It Works (with custom secrets)

1. **Environment Variable Resolution**: The MCP client uses the `packageName` to determine which environment variables are required for authentication.

2. **Custom Secrets Resolution**: The client also checks the `x-auth-custom-secrets` array for additional required environment variables.

3. **Authentication Flow**: When a tool is executed, the client:
   - Checks the `x-auth-packages` array
   - Checks the `x-auth-custom-secrets` array
   - Resolves the required environment variables for each package and custom secrets
   - Passes these credentials to the underlying service
