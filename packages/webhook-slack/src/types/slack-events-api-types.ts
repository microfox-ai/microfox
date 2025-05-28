export * from '@slack/types';
import type { SlackEvent, FunctionExecutedEvent } from '@slack/types';
import type {
  ChatPostMessageArguments,
  ChatPostMessageResponse,
} from '@slack/web-api';
/**
/** Using type parameter T (generic), can distribute the Omit over a union set. */
type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;
/**
 * Extend this interface to build a type that is treated as an open set of properties, where each key is a string.
 */
export type StringIndexed = Record<string, any>;

export type SayArguments = DistributiveOmit<
  ChatPostMessageArguments,
  'channel'
> & {
  channel?: string;
};
export type SayFn = (
  message: string | SayArguments,
) => Promise<ChatPostMessageResponse>;
export type RespondArguments = DistributiveOmit<
  ChatPostMessageArguments,
  'channel' | 'text'
> & {
  /** Response URLs can be used to send ephemeral messages or in-channel messages using this argument */
  response_type?: 'in_channel' | 'ephemeral';
  replace_original?: boolean;
  delete_original?: boolean;
  text?: string;
};
export type RespondFn = (message: string | RespondArguments) => Promise<any>;
export type AckFn<Response> = (response?: Response) => Promise<void>;
/**
 * Arguments which listeners and middleware receive to process an event from Slack's Events API.
 */
export type SlackEventMiddlewareArgs<EventType extends string = string> = {
  payload: EventFromType<EventType>;
  event: EventFromType<EventType>;
  body: EnvelopedEvent<EventFromType<EventType>>;
} & (EventType extends 'message'
  ? {
      message: EventFromType<EventType>;
    }
  : unknown) &
  (EventFromType<EventType> extends
    | {
        channel: string;
      }
    | {
        item: {
          channel: string;
        };
      }
    ? {
        say: SayFn;
      }
    : unknown) &
  (EventType extends 'function_executed'
    ? {
        inputs: FunctionExecutedEvent['inputs'];
        ack: AckFn<void>;
      }
    : {
        ack?: undefined;
      });
export interface BaseSlackEvent<T extends string = string> {
  type: T;
}
export type EventTypePattern = string | RegExp;
export type FunctionInputs = Record<string, unknown>;
/**
 * A Slack Events API event wrapped in the standard envelope.
 *
 * This describes the entire JSON-encoded body of a request from Slack's Events API.
 */
export interface EnvelopedEvent<Event = BaseSlackEvent> extends StringIndexed {
  token: string;
  team_id: string;
  enterprise_id?: string;
  api_app_id: string;
  event: Event;
  type: 'event_callback';
  event_id: string;
  event_time: number;
  is_ext_shared_channel?: boolean;
  authorizations?: Authorization[];
}
interface Authorization {
  enterprise_id: string | null;
  team_id: string | null;
  user_id: string;
  is_bot: boolean;
  is_enterprise_install?: boolean;
}
/**
 * Type function which given a string `T` returns a type for the matching Slack event(s).
 *
 * When the string matches known event(s) from the `SlackEvent` union, only those types are returned (also as a union).
 * Otherwise, the `BasicSlackEvent<T>` type is returned.
 */
export type EventFromType<T extends string> =
  KnownEventFromType<T> extends never
    ? BaseSlackEvent<T>
    : KnownEventFromType<T>;
export type KnownEventFromType<T extends string> = Extract<
  SlackEvent,
  {
    type: T;
  }
>;

/**
 * Arguments which listeners and middleware receive to process a slash command from Slack.
 */
export interface SlackCommandMiddlewareArgs {
  payload: SlashCommand;
  command: this['payload'];
  body: this['payload'];
  say: SayFn;
  respond: RespondFn;
  ack: AckFn<string | RespondArguments>;
}
/**
 * A Slack slash command
 *
 * This describes the entire URL-encoded body of a request from Slack's slash commands.
 */
export interface SlashCommand extends StringIndexed {
  token: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
  user_id: string;
  user_name: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  api_app_id: string;
  enterprise_id?: string;
  enterprise_name?: string;
  is_enterprise_install?: string;
}
