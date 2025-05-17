# AI Coding Agent (Gemini Powered)

This project implements an AI Coding Agent within the `packages/coding-agent/` directory. The agent is designed to understand tasks from user prompts, generate functional Python code using the Google Gemini API, deploy that code, and iteratively improve its own capabilities.

## Core Objectives & Capabilities

This agent fulfills the following primary goals:

1.  **Accepts Prompts/Tasks**: It takes user instructions as command-line input to define its tasks.
2.  **Generates & Deploys Working Code**: Leveraging the Gemini API, it translates prompts into runnable Python code, saves this code to a local file, and executes it, capturing the output.
3.  **Iterative Self-Improvement**: The agent can modify its own codebase based on specific instructions. This is facilitated by the Gemini API generating special commands that the agent interprets to, for example, add new functions to its utility files.

## How It Works

1.  **Input**: The user provides a prompt to `main.py` via the command line.
2.  **LLM Interaction (`llm_interface.py`)**: 
    *   The prompt is augmented with a system message that instructs the Gemini API on the desired output format.
    *   It calls the configured Gemini model (e.g., `models/gemini-1.5-flash-latest`) with this combined prompt.
3.  **Response Processing (`code_generator.py`)**: 
    *   If the Gemini API returns Python code, it's flagged as a `CODE_EXECUTION_TASK`.
    *   If the API returns a special command string (e.g., `AGENT_SELF_IMPROVE:...`), it's flagged as a `SELF_IMPROVE_TASK`.
4.  **Code Execution (`code_deployer.py`)**: 
    *   For `CODE_EXECUTION_TASK`, the received Python code is saved to `generated_code/script.py` and executed. Output/errors are captured.
5.  **Self-Modification (`self_improver.py`)**: 
    *   For `SELF_IMPROVE_TASK`, the command is parsed, and the agent modifies its own files (e.g., adding a function to `utils.py`).
6.  **Logging**: All significant actions, API calls, generated code, and outputs are logged to `agent.log` for debugging and traceability.

## Key Components

*   **`main.py`**: Orchestrates the agent's workflow from prompt input to final output.
*   **`llm_interface.py`**: Handles all communication with the Google Gemini API, including API key management and prompt construction.
*   **`code_generator.py`**: Interprets the Gemini API's response to decide the type of task.
*   **`code_deployer.py`**: Saves and executes Python code generated for standard tasks.
*   **`self_improver.py`**: Implements the logic for the agent to modify its own code.
*   **`utils.py`**: A utility file that the agent can extend as part of its self-improvement process.
*   **`.env`**: (Gitignored) Stores the `GEMINI_API_KEY`. **You must create this file.**
*   **`requirements.txt`**: Lists Python dependencies (`google-generativeai`, `python-dotenv`).
*   **`generated_code/`**: Directory where dynamically generated scripts are stored by the agent.
*   **`agent.log`**: Provides a detailed log of the agent's operations.

## Setup and Usage

1.  **Prerequisites**:
    *   Python 3.x installed.
    *   A Google Gemini API key.

2.  **Configure API Key**:
    *   In the `packages/coding-agent/` directory, create a file named `.env`.
    *   Add your Gemini API key to this file in the following format:
        ```env
        GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
        ```
    *   This `.env` file is included in the project's root `.gitignore` and will not be committed to your repository.

3.  **Install Dependencies**:
    *   Navigate to the `packages/coding-agent/` directory in your terminal.
    *   Install the required Python libraries:
        ```bash
        pip install -r requirements.txt 
        # Or, for a specific Python version like 3.11:
        # C:\Python311\python.exe -m pip install -r requirements.txt
        ```

4.  **Run the Agent**:
    *   From the **root directory** of this repository (e.g., `D:\Coding\Github Local\microfox\`), execute the agent:
        ```bash
        python packages/coding-agent/main.py "YOUR PROMPT HERE"
        ```

### Example Prompts:

*   **Code Generation & Execution Task**:
    ```bash
    python packages/coding-agent/main.py "create a python script that prints a list of numbers from 1 to 5"
    ```
    *(Agent contacts Gemini, gets Python code, saves it to `generated_code/script.py`, runs it, and shows output.)*

*   **Self-Improvement Task (Adding a function to `utils.py`)**:
    ```bash
    python packages/coding-agent/main.py "add a function to packages/coding-agent/utils.py called calculate_sum that takes two numbers (a, b) and prints their sum"
    ```
    *(Agent contacts Gemini, gets an `AGENT_SELF_IMPROVE:...` command, then modifies `utils.py` accordingly.)*

## Goal: Pull Request

Once this agent is functioning robustly, the aim is to create a Pull Request (PR) to the original repository, contributing this self-improving coding agent.

## Future Enhancements (Conceptual)

*   Refine the system prompt for the Gemini API for more consistent and complex interactions.
*   Expand self-improvement capabilities (e.g., modifying existing functions, creating new files based on more intricate logic, managing dependencies).
*   Implement more robust error handling and recovery, especially for API interactions and code execution.
*   Enable the agent to read existing files for better contextual understanding before generating or modifying code.
*   Integrate with version control (Git) for more sophisticated self-modification tracking and safety. 