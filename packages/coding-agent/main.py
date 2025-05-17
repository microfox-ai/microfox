import sys
import os
import logging

# Setup logging
LOG_FILE = "agent.log"
# Clear previous log file content if it exists
if os.path.exists(LOG_FILE):
    os.remove(LOG_FILE)
logging.basicConfig(filename=LOG_FILE, level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Adjust system path
current_script_dir = os.path.dirname(os.path.abspath(__file__))
if current_script_dir not in sys.path:
    sys.path.insert(0, current_script_dir)
logging.debug(f"Sys.path modified: {sys.path}")

# Define WORKSPACE_ROOT assuming main.py is in packages/coding-agent/
WORKSPACE_ROOT = os.path.dirname(os.path.dirname(current_script_dir)) # Go up two levels for workspace root
logging.info(f"Workspace root calculated as: {WORKSPACE_ROOT}")

from llm_interface import get_llm_response
from code_generator import generate_code
from code_deployer import deploy_and_run_code, GENERATED_CODE_DIR # Import GENERATED_CODE_DIR
from self_improver import improve_agent

def main():
    logging.info(f"Executing main() from {__file__}")
    if len(sys.argv) > 1:
        prompt = " ".join(sys.argv[1:])
        logging.debug(f"Prompt from sys.argv: {prompt}")
    else:
        logging.debug("No prompt from sys.argv, using input().")
        # For non-interactive testing with run_terminal_cmd, we should ensure a prompt is passed via argv.
        # prompt = input("Enter your prompt for the coding agent: ") 
        # Fallback if not run interactively and no args given.
        prompt = "Default prompt: list files in current directory"
        logging.warning("Using default prompt as no arguments were supplied and input() is problematic in this context.")


    logging.info(f"Received prompt: {prompt}")

    llm_response = get_llm_response(prompt)
    logging.info(f"LLM responded: {llm_response}")

    task_type, task_data = generate_code(llm_response)
    logging.info(f"Generated task type: {task_type}, Task data: {task_data}")

    if task_type == "CODE_EXECUTION_TASK":
        logging.info(f"Deploying and running code for prompt: {prompt}")
        output = deploy_and_run_code(task_data)
        logging.info(f"Execution output:\n{output}")
        print(f"Execution output:\n{output}") # Also print to stdout for cases where it might work
    elif task_type == "SELF_IMPROVE_TASK":
        logging.info(f"Agent is attempting to self-improve based on: {task_data}")
        improvement_result = improve_agent(task_data, WORKSPACE_ROOT)
        logging.info(f"Self-improvement result: {improvement_result}")
        print(f"Self-improvement result: {improvement_result}")
    else:
        logging.error(f"Unknown task type: {task_type}")
        print(f"Unknown task type: {task_type}")
    logging.info("Main function finished.")

if __name__ == "__main__":
    logging.info(f"Starting script: {os.path.abspath(__file__)}")
    try:
        main()
    except Exception as e:
        logging.error(f"Unhandled exception in main: {e}", exc_info=True)
        print(f"Unhandled exception: {e}") # Also print to stdout
    logging.info(f"Script finished: {os.path.abspath(__file__)}") 