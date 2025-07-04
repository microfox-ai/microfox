HERE are the 1 basically

-

basically there are 3 things

1. Open API schema converted into a tool call with (description, parametrs, name & execute =>)

2. Human In Loop -> which bypasses execute by returning empty, createing a new fake tool-call, processing it & adding tool-result part

3. Auth Insertion -> insertion of auth needs to happen at exeecute layer by calling a function, or by referring to the default tool constructor options.

executeMetadata -> only we need to know, no one needs to know.

Auth Insertion
Inside tool execute -> call the given function (which can be provided at client level (same for all tools) or at tool level) to fetch the auth that is to be inserted.
if no function is provided, it can fetch from the presetBodyFields.auth, if even there it is not provided, call the operation with any auth,
the auth insertion can also be defined in mcp_1.0.1 by specifying a particular endpoint that needs to be called, to fetch a temp access token, for this operation (like a nested docData maybe)

finally @mcp_1.0.1.json - create a new version, that defines x-oauth-call that is an endpoint which will be called just like getOauth to fetch the clientSecrets inside a tool execution just before the callOperation, and inserts it into auth object in the defined auth format.

the x-auth-provider should support both apikey based or oauth based (to fetch the secrets - for now apikey is enough, but apikey only mentions the key like open api that needs to be passed on to the endpoint ), x-auth-provider should be at both root level as well as at path level (path takes prefernece over root)

Human in Loop
when execute is triggered -> -> return null

How human in loop works
in ai sdk, basically if i either remove execute function, or return null inisde execute function, the ai stops working. in the current implementation we are removing the execute functions. I want you to remove all occurences like that & instead use null to stop execution.

next step is to false insert a tool call via this, just before it return null.
if (dataStream) {
dataStream.write(
formatDataStreamPart('tool_call', {
toolCallId: toolInvocation.toolCallId,
args,
}),
);
}

      // Return updated toolInvocation with the actual result.
      return {
        ...part,
        toolInvocation: {
            state: 'call',
            args:
        },
      };

use a toolName called FAKE_HUMAN_INTERACTION in order to do this hack, the args, should resent a neat structured object, which will either show different UI for different stuff - approve/deny or text-input or ui-input if its text-input, it should collect the required arguments for the stopped tool execution in a series of steps, like ask user a message, user responds by message, etc.. , if its ui-input, it should collect the require arguments by means of an UI with args having the requiredArgs, uiCOmponentName, & such stuff,

just like we did it in auth case, I think it i sbettter to also give a callback, which developers can use to write their own logic, for this fakeHumanInteraction tool call that puts a pause on tool execution, making the args of this toolcall unique as needed by dev, but we should have some base internal parameters that help us detect in the args, that are not passed for the dev, but used to to the processToolCall layer at the step before the tool calls are inserted.

theese internal args are used to match & find the pendingTOolexecution and helps use nable it to continue, by passing off the arguments collected from input into its args, and also removing this fake tool step in the message before processing it to ai. by doing this, we can create a cleaner version for devs, and they can focus on their own usage of human intervention logic without bothering about how to stuff it to ai & all.

also whether a tool call should be paused or not is currently defined at the root level or tool level by disableExecution or disableAllExecutions, what i want to do is this - the human intervention should be defined as a default stuff in mcp_version schema (at client or path level) as well as getHumanIntervention callback (again at client or path level), and if if its not written anywhere, tool call will be implemented as expected. the callback should feed in the the params as the same as the getAuth, where as responseMapping is not needed, as this is just to dientify what args needed to be passed on the fakehuman tool-call, or if it should be pasued at all, if it is need not to be paused,t he toolexecution should runa s is.

My main reasons for shifting the human, stuff inside the execution is, sometimes the generated args/parameters for the toolcall decide whether the humanInteraction is needed or not, giving more power to the dev on how he can go on to implement this.
