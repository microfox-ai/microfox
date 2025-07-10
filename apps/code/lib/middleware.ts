/**
 * A middleware that traces the execution of agents.
 * It logs the entry and exit of each agent to the console
 * and records the agent's path in the TaskContext.
 */
export const tracingMiddleware = async (ctx: any, next: () => Promise<void>) => {
  // The state object (`ctx.state`) is the carrier for our TaskContext.
  // We can initialize it here if this is the first middleware.
  if (!ctx.state.initialPrompt) {
    // This is a simplistic way to check; in a real app, you might have a more robust
    // initialization step. For now, we'll assume the orchestrator sets it up.
  }

  // Get the path of the agent being called from the internal execution context.
  const path = ctx.executionContext?.currentPath || 'unknown_path';
  
  console.log(`[Trace] ==> Entering: ${path}`);
  
  // Add the current path to our trace log on the state object.
  if (ctx.state.executionTrace) {
    ctx.state.executionTrace.push(path);
  }

  // Proceed to the next handler in the chain (the actual agent).
  await next();

  console.log(`[Trace] <== Exiting: ${path}`);
}; 