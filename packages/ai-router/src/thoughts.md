First read this and understand that it was designed base don express logic,

but the necessities for this framework is like this -

the paths are just keys to identify & structure the agents.

for example, if an agent is defined as
/hellofox - it is a valid agent that is callable by anywhere.
if an agent is defined as
/hellofox/casual - which can only be called by hellofox.
/hellofox/query - which can only be called by hellofox.

code structured

const answerUsersQuery = new AgentRouter()
answerUserQuery.agent("/", (props) => {
props.callTool("/task/{task_id}") => this should fail, as there is no tool at /hellofox/query/task/{task_id} or at /task/{task_id}
props.callTool("/hellofox/task/{task_id}") => this should work as there is a tool at /hellofox/task/{task_id} but not at /hellofox/query/task/{task_id}

cosnt response = props.callAgent("/casual") should trigger the casual agent

    props.attachTool("/task/${task_id}") -> should give a formatted tool that can be added to generateObject(),streamObject()

    props.attachAgentAsTool("/hellofox/casual") -> should give a formatted tool that will run the agent as a tool

})

const hellofox = new AgentRouter()
// middleware for all routes inside hellfox
hellofox.use("/", feedMicrofoxInformation)
// middleware only for task related routes.
hellofox.use("/task", checkTaskPermissions)
// tool (which might have subagents, but not routing, its the endpoint)
hellofox.tool("/task/:task_id", fetchCurrentTasks, options)
hellofox.tool("/task/list", listCurrentTasks)
hellofox.agent("/casual", casualGreeter)
hellofox.agent("/query", answerUsersQuery)

inside answerQuery, in toolcalls, you can attach fetchCurrentTasks as tools with task_id.
also you can directly call the tool with task_id as well like "/hellofox/task/:task_id", will execute the tool, and answer back -> tools are non streamable or streamabel depending on passed parameter in tool options, inside options, also give a callback, that get executed before the tool is called.

const app = new AgentRouter()
app.use("/",feedMessages)
app.use("/",trackTokenusage)
app.agent("/hellofox", hellofox);

to avoid circualr dependencies, there should be a callTool inside the props
so like, inside, answerUserQuery,

the differences beween use, agent, tool.

use - is a middleware that runs at every match inside that scoped defined kit.
agent - is also runs at every match, but its linked to another subagentRotuer
tool - is a single function call, where there is execution happening.

it is important, that state passed down the line in agents. also any agent or tool should be triggerable from inside anywhere
