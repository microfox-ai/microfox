import openai
import subprocess
from dotenv import load_dotenv
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_code(task):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful coding assistant."},
                {"role": "user", "content": f"Write Python code for: {task}"}
            ]
        )
        code = response['choices'][0]['message']['content']
        return code
    except Exception as e:
        return f"Error generating code: {e}"

def run_code(code):
    try:
        with open("temp_code.py", "w", encoding="utf-8") as f:
            f.write(code)
        result = subprocess.run(
            ["python", "temp_code.py"], capture_output=True, text=True, timeout=10
        )
        output = result.stdout + result.stderr
        return output
    except Exception as e:
        return f"Error running code: {e}"

def improve_code(code, error):
    try:
        prompt = f"""
        The following Python code has an error:
        {code}

        The error is:
        {error}

        Please provide corrected code.
        """
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        fixed_code = response['choices'][0]['message']['content']
        return fixed_code
    except Exception as e:
        return f"Error improving code: {e}"
