## Function: `wrapLanguageModel`

The `wrapLanguageModel` function enhances the behavior of language models by wrapping them with middleware. This allows you to add functionality like logging, input/output transformation, error handling, and more without modifying the core language model implementation.  See Language Model Middleware for more information on middleware (this documentation assumes you have access to the linked "Language Model Middleware" documentation).

**Purpose:**

To extend the functionality of a `LanguageModelV1` instance using middleware, enabling pre- and post-processing of inputs and outputs, error handling, and other custom behaviors.

**Parameters:**

* **`model`**: (required) `LanguageModelV1` - The original `LanguageModelV1` instance to be wrapped.  This is the base language model that the middleware will enhance.  (Assumes `LanguageModelV1` interface is documented elsewhere).

* **`middleware`**: (required) `LanguageModelV1Middleware | LanguageModelV1Middleware[]` - The middleware function or an array of middleware functions to apply.  If an array is provided, the middleware are applied in order, with the first transforming the input first and the last wrapping directly around the model. (Assumes `LanguageModelV1Middleware` interface is documented elsewhere).

* **`modelId`**: (optional) `string` - A custom model ID to override the original model's ID. This can be useful for tracking or identifying the wrapped model.

* **`providerId`**: (optional) `string` - A custom provider ID to override the original model's provider. This can be useful for tracking or identifying the source of the wrapped model.


**Return Value:**

`LanguageModelV1` - A new `LanguageModelV1` instance with the specified middleware applied. This wrapped instance will have the same interface as the original `LanguageModelV1` but with the added behavior provided by the middleware.


**Examples:**

```typescript
import { wrapLanguageModel } from 'ai';
// Assume 'yourModel' is an instance of LanguageModelV1 and 'yourLanguageModelMiddleware' is an instance of LanguageModelV1Middleware
// These types are assumed to be defined and documented elsewhere.

// Example 1: Wrapping with a single middleware
const wrappedLanguageModel1 = wrapLanguageModel({
  model: yourModel,
  middleware: yourLanguageModelMiddleware,
});

// Example 2: Wrapping with multiple middleware
const wrappedLanguageModel2 = wrapLanguageModel({
  model: yourModel,
  middleware: [middleware1, middleware2, middleware3],
});

// Example 3: Overriding model and provider IDs
const wrappedLanguageModel3 = wrapLanguageModel({
  model: yourModel,
  middleware: yourLanguageModelMiddleware,
  modelId: 'custom-model-id',
  providerId: 'custom-provider-id',
});

// Example 4: Minimal usage
const wrappedLanguageModel4 = wrapLanguageModel({
  model: yourModel,
  middleware: yourLanguageModelMiddleware,
});

// Example 5 (Illustrative - assumes specific methods on LanguageModelV1 and behavior of middleware):
const response = await wrappedLanguageModel4.generateText("What is the meaning of life?");
console.log(response); // Output will be influenced by the applied middleware.

```
