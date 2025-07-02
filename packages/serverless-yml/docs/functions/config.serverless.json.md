# `config.serverless.json`

This configuration file allows packages to define how they affect the `serverless.yml` configuration of a service.

When a package (e.g., `@microfox/puppeteer-sls`) is added to a microservice, `microfox` will look for a `config.serverless.json` file for that package and apply the specified configurations to the service's `serverless.yml`.

## File Structure

The `config.serverless.json` is a JSON object with the following top-level keys:

- `package`: Defines packaging configurations.
- `provider`: Defines provider-level configurations.
- `functions`: Defines function-level configurations.

### `package`

This section is merged with the `package` section of `serverless.yml`. Any arrays like `include` and `exclude` will be merged.

**Example:**

```json
{
  "package": {
    "include": ["some-file.js"],
    "exclude": ["node_modules/unwanted-dep/**"],
    "individually": true
  }
}
```

### `provider`

This section is merged with the `provider` section of `serverless.yml`.

**Example:**

```json
{
  "provider": {
    "timeout": 60,
    "memorySize": 512
  }
}
```

### `functions`

This section allows modification of all functions in the service. For now, it supports adding layers to all functions. In the future, it might support more complex rules.

**Example:**

```json
{
  "functions": {
    "layers": ["arn:aws:lambda:us-east-1:xxxx:layer:my-layer:1"]
  }
}
```
