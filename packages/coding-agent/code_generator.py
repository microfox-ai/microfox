import os

def generate_code(llm_response: str) -> tuple[str, str | None]:
    """Generates executable code from LLM response."""
    if llm_response.startswith("AGENT_SELF_IMPROVE:"):
        return "SELF_IMPROVE_TASK", llm_response # Pass the full command for self-improvement
    return "CODE_EXECUTION_TASK", llm_response 