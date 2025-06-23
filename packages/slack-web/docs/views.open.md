# views.open

The `views.open` method opens a modal for a user. Modals are focused surfaces that can be used for a variety of interactions, including forms, alerts, and more.

## Usage

To open a modal, you need a `trigger_id` which is a short-lived token received after a user interaction (e.g., clicking a button, using a shortcut).

```typescript
import { WebClient } from '@microfox/slack-web';

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

(async () => {
  // trigger_id is received from an interaction payload
  const triggerId = '12345.98765.abcd2358fdea';

  try {
    const result = await web.views.open({
      trigger_id: triggerId,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'My Awesome Modal'
        },
        submit: {
          type: 'plain_text',
          text: 'Submit'
        },
        blocks: [
          {
            type: 'input',
            element: {
              type: 'plain_text_input'
            },
            label: {
              type: 'plain_text',
              text: 'What is your name?'
            }
          }
        ]
      }
    });

    console.log(result.view);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

-   `trigger_id` (string): Exchange a trigger to post to the user.
-   `view` (object): A view payload. This must be a JSON-encoded string.

## Response

A successful call returns a `view` object.

### View Object Schema

| Field             | Type    | Description                                                                                                                                                                                                                                                  |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`              | String  | The unique identifier for the view.                                                                                                                                                                                                                          |
| `team_id`         | String  | The ID of the team that the view belongs to.                                                                                                                                                                                                                 |
| `type`            | String  | The type of view. Set to `modal` for modals.                                                                                                                                                                                                                 |
| `title`           | Object  | The title that appears in the top-left of the modal. Must be a `plain_text` text element with a max length of 24 characters.                                                                                                                                |
| `submit`          | Object  | A `plain_text` element that defines the text displayed in the submit button at the bottom-right of the view. `submit` is required when an input block is within the blocks array. Max length of 24 characters.                                              |
| `blocks`          | Array   | An array of blocks that defines the content of the view. Max of 100 blocks.                                                                                                                                                                                  |
| `private_metadata`| String  | A string that will be sent to your app in `view_submission` and `block_actions` events. Max length of 3000 characters.                                                                                                                                         |
| `callback_id`     | String  | An identifier to recognize interactions and submissions of this particular view. Don't use this to store sensitive information (use `private_metadata` instead). Max length of 255 characters.                                                               |
| `external_id`     | String  | A custom identifier that must be unique for all views on a per-team basis.                                                                                                                                                                                   |
| `state`           | Object  | An object that contains the state of any interactive components in the view.                                                                                                                                                                                 |
| `hash`            | String  | A unique value that is used to ensure that the correct view is being updated.                                                                                                                                                                                |
| `clear_on_close`  | Boolean | When set to true, clicking on the close button will clear all views in a modal and close it. Defaults to `false`.                                                                                                                                             |
| `notify_on_close` | Boolean | Indicates whether Slack will send your request URL a `view_closed` event when a user clicks the close button. Defaults to `false`.                                                                                                                            |
| `root_view_id`    | String  | The ID of the root view.                                                                                                                                                                                                                                     |
| `app_id`          | String  | The ID of the app that created the view.                                                                                                                                                                                                                     |
| `bot_id`          | String  | The ID of the bot user that created the view.                                                                                                                                                                                                                |

### Error Response

```json
{
    "ok": false,
    "error": "invalid_arguments",
    "response_metadata": {
        "messages": [
            "invalid `trigger_id`"
        ]
    }
}
```

## Errors

| Error | Description |
| --- | --- |
| `duplicate_external_id` | The given `external_id` has already been used. |
| `exchanged_trigger_id` | The `trigger_id` was already exchanged in a previous call. |
| `expired_trigger_id` | The `trigger_id` has expired. |
| `invalid_trigger_id` | The `trigger_id` is invalid. |
| `view_too_large` | The provided view is greater than 250kb. |
| `not_authed` | No authentication token provided. |
| `invalid_auth` | Some aspect of authentication cannot be validated. |
| `account_inactive` | Authentication token is for a deleted user or workspace. |
| `token_revoked` | Authentication token is for a deleted user or workspace or the app has been removed. |
| `no_permission` | The workspace token used in this request does not have the permissions necessary to complete the request. |
| `invalid_arg_name` | The method was passed an argument whose name falls outside the bounds of accepted or expected values. |
| `invalid_array_arg` | The method was passed an array as an argument. |
| `invalid_charset` | The method was called via a POST request, but the charset specified in the `Content-Type` header was invalid. |
| `invalid_form_data` | The method was called via a POST request with `Content-Type` `application/x-www-form-urlencoded` or `multipart/form-data`, but the form data was either missing or syntactically invalid. |
| `invalid_post_type` | The method was called via a POST request, but the specified `Content-Type` was invalid. |
| `missing_post_type` | The method was called via a POST request and included a data payload, but the request did not include a `Content-Type` header. |
| `request_timeout` | The method was called via a POST request, but the POST data was either missing or truncated. |
| `ratelimited` | The request has been ratelimited. |
| `accesslimited` | Access to this method is limited on the current network. |
| `fatal_error` | The server could not complete your operation(s) without encountering a catastrophic error. |
| `internal_error` | The server could not complete your operation(s) without encountering an error. |
| `service_unavailable` | The service is temporarily unavailable. | 