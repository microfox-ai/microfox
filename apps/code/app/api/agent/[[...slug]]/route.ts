import { AiRouter } from '@microfox/ai-router';
import { tracingMiddleware } from '@/lib/middlewares/tracingAgents';
import { receptionistAgent } from '@/lib/agents';

const agentRouter = new AiRouter();

agentRouter.use('*', tracingMiddleware);

agentRouter.agent('/', receptionistAgent);

// We will export a POST handler that processes all incoming requests.
// The `[[...slug]]` in the filename makes this a catch-all route under /agent.
export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
  // Determine the path from the URL slug.
  const path = `/${(params.slug || []).join('/')}`;
  
  const body = await request.json();
  const { messages, ...restOfBody } = body;
  console.log("body", body)
  console.log("messages", messages)
  console.log("path", path)


  // Let the AiRouter handle the request and generate a response.
  // We add an empty 'messages' array to the request to satisfy the router's type.
  const response = agentRouter.handle(path, {
    request: {
      ...restOfBody,
      messages: messages || []
    }
  });

  // Return the response generated by the agent.
  return response;
} 