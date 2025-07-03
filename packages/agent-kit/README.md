# @microfox/agent-connector

// `// const response = agentConnector.receiveEvents({})
//`

// askForApproval -> sends a message somehwere with job_id, & type=approval, ->
// selectAnOption -> sends a message somewhere with job_id, & type=select_option, ->

// task_status -> in_queue, in_progress, awaiting_input, completed, failed, cancelled, unknown

// does vercel crons work in our deployment?

// modify_task, update_task, delete_task,

// notification/user_input-approvals/selection/query - where/who - collection

// test success - ask pramod, if he's avialble on tuesday.
// job -
// step 1 - get pramod's userId & DM channel id, (intelligence decides whether to ask for selection/confirmation)
// step 2 - send a message to him. (intelligence decides whether to ask for approval)
// step 3 - (create a job, if he responds, respond back to origin user)

Slack Internal Meeting Scheduler.

1. Hi pramod, are you available for a call with subhakar on tuesday
2. intelligence to follow up if pramod does not respond within 8hrs.
3. intelligence to contact on another platform if he still does not respond.
4. process data collected and continue with existing job (adding on a message to the job message queue)
5. maybe i should shedule a meeting, but i need to know what time, let me confirm with bothe of them for an accurate time. or maybe meeting is not needed, lets ask the initiator - subhakar
6. subhakar, shall i schedule a meeting, what time is comfortable for you ? with buttons (not needed, morning, afternoon, evening, night, exact time)
7. process data collected, if not needed - mark job as complete

Slack External Meeting
