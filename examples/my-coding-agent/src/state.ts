// state.ts
// Saves and loads history of tasks and code outputs.

import fs from "fs";
import path from "path";
import { Task } from "./prompt";

const stateFile = path.join(__dirname, "agent_state.json");

interface AgentState {
  tasks: Task[];
}

export function saveState(state: AgentState) {
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

export function loadState(): AgentState {
  if (!fs.existsSync(stateFile)) return { tasks: [] };
  return JSON.parse(fs.readFileSync(stateFile, "utf-8"));
}

