import logging
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
# Ensure .env is in the same directory as this script or the script's CWD
_current_dir = os.path.dirname(os.path.abspath(__file__))
_env_path = os.path.join(_current_dir, ".env")
if os.path.exists(_env_path):
    load_dotenv(dotenv_path=_env_path)
else:
    logging.warning(".env file not found at expected location. API key might not be loaded.")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    logging.error("GEMINI_API_KEY not found in environment variables. Please ensure it is set in .env")
    # Raise an error or provide a default behavior if the key is missing
    # For now, we'll allow it to proceed but it will likely fail at API call.
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        logging.error(f"Failed to configure Gemini API: {e}", exc_info=True)

# Using a model capable of text generation. 'gemini-pro' is a common choice.
# You might want to make the model name configurable too.
MODEL_NAME = "models/gemini-1.5-flash-latest"

GENERATION_CONFIG = {
    "temperature": 0.7,       # Controls randomness. Lower for more deterministic, higher for more creative.
    "top_p": 1.0,             # Nucleus sampling parameter.
    "top_k": 1,               # Top-k sampling parameter.
    "max_output_tokens": 2048 # Maximum number of tokens to generate.
}

SAFETY_SETTINGS = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

def get_llm_response(prompt: str) -> str:
    if not GEMINI_API_KEY:
        logging.error("Gemini API key is not configured. Returning a placeholder error response.")
        return "ERROR: Gemini API key not configured."

    try:
        model = genai.GenerativeModel(model_name=MODEL_NAME, 
                                      generation_config=GENERATION_CONFIG, 
                                      safety_settings=SAFETY_SETTINGS)
    except Exception as e:
        logging.error(f"Failed to initialize Gemini model: {e}", exc_info=True)
        return f"ERROR: Failed to initialize Gemini model: {e}"

    # Construct a more detailed prompt for Gemini to guide its output format
    # This is crucial for distinguishing between code generation and self-improvement tasks.
    system_prompt = (
        "You are an AI Coding Agent. Your primary function is to generate Python code or specific agent commands."
        "\n\nINSTRUCTIONS FOR YOUR RESPONSE:"
        "1. If the user asks you to generate a Python script for a general task, respond ONLY with the complete, runnable Python code for that script. Do not include any explanations or markdown formatting like ```python ... ```."
        "2. If the user asks you to perform an action on YOUR OWN INTERNAL files (e.g., 'add a function to utils.py', 'modify your configuration'), this is a self-improvement task. In this case, respond ONLY with a special command string in the following format:"
        "   AGENT_SELF_IMPROVE:COMMAND_TYPE:TARGET_FILE_PATH:FUNCTION_NAME:PARAM1=VALUE1,PARAM2=VALUE2"
        "   Example for creating a function: AGENT_SELF_IMPROVE:CREATE_FUNCTION:packages/coding-agent/utils.py:my_new_function:arg1='default_value',count=5"
        "   Ensure TARGET_FILE_PATH is relative to the workspace root (e.g., 'packages/coding-agent/utils.py')."
        "\n\nUser Prompt:"
    )
    
    full_prompt = f"{system_prompt}\n{prompt}"
    logging.info(f"Sending prompt to Gemini: {prompt}") # Log only user part of prompt for brevity
    # logging.debug(f"Full prompt to Gemini:\n{full_prompt}") # Uncomment for debugging full prompt

    try:
        response = model.generate_content(full_prompt)
        llm_output = response.text
        logging.info(f"Gemini raw response: {llm_output}")
        return llm_output
    except Exception as e:
        logging.error(f"Error calling Gemini API: {e}", exc_info=True)
        return f"ERROR: Failed to get response from Gemini API: {e}"

# Example of how the self-improvement directive might be triggered by user prompt:
# User prompt: "add a function to packages/coding-agent/utils.py called print_custom_message with argument message='Hello from Gemini agent'"
# Expected Gemini Response (if it follows instructions):
# AGENT_SELF_IMPROVE:CREATE_FUNCTION:packages/coding-agent/utils.py:print_custom_message:message='Hello from Gemini agent'

# Example of code generation:
# User prompt: "create a script that lists files in the current directory"
# Expected Gemini Response (if it follows instructions):
# import os
# print(os.listdir('.')) 