import os
import subprocess
import logging

# Ensure GENERATED_CODE_DIR is relative to this script's location
_current_script_dir = os.path.dirname(os.path.abspath(__file__))
GENERATED_CODE_DIR = os.path.join(_current_script_dir, "generated_code")

def ensure_generated_code_dir_exists():
    if not os.path.exists(GENERATED_CODE_DIR):
        logging.debug(f"Creating directory: {GENERATED_CODE_DIR}")
        os.makedirs(GENERATED_CODE_DIR)
    else:
        logging.debug(f"Directory already exists: {GENERATED_CODE_DIR}")

def deploy_and_run_code(code_content: str, filename: str = "script.py") -> str:
    ensure_generated_code_dir_exists()
    filepath = os.path.join(GENERATED_CODE_DIR, filename)
    logging.debug(f"Attempting to write code to: {filepath}")
    try:
        with open(filepath, "w") as f:
            f.write(code_content)
        logging.info(f"Code written to {filepath}")
        
        logging.debug(f"Executing script: python {filepath}")
        # Using check=False to capture stderr even on non-zero exit codes
        result = subprocess.run(["python", filepath], capture_output=True, text=True, check=False, cwd=_current_script_dir)
        
        if result.returncode == 0:
            logging.info(f"Execution successful. Stdout:\n{result.stdout}")
            return result.stdout
        else:
            # Log both stdout and stderr for errors, as script might print to stdout before failing
            logging.error(f"Error during execution. Return code: {result.returncode}. Stderr:\n{result.stderr}\nStdout:\n{result.stdout}")
            return f"Execution failed with return code {result.returncode}.\nStderr:\n{result.stderr}\nStdout (if any):\n{result.stdout}"

    except FileNotFoundError:
        logging.error(f"Error: Python interpreter not found. Please ensure Python is installed and in PATH.")
        return "Error: Python interpreter not found."
    # except subprocess.CalledProcessError as e: # This won't be caught if check=False
    #     logging.error(f"Error during execution: {e.stderr}")
    #     return e.stderr
    except Exception as e:
        logging.error(f"An unexpected error occurred in deploy_and_run_code: {e}", exc_info=True)
        return f"An unexpected error occurred: {e}" 